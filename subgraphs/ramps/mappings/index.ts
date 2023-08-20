/* eslint-disable prefer-const */
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Ramp, Session, Vote, Token, Transaction, Account, NFT } from "../generated/schema";
import { toBigDecimal } from "./utils";
import {
  CreateGauge,
  PreMint,
  UpdateRampInfo,
  CreateProtocol,
  AddToken,
  RemoveToken,
  DeleteProtocol,
  ClaimPendingRevenue,
  Mint,
  Burn,
  Voted,
  LinkAccount,
  PostMint,
  UpdateMiscellaneous,
} from "../generated/RampHelper/RampHelper";
import { fetchNoteURI } from "./utils/erc721";

let ZERO_BI = BigInt.fromI32(0);
let ONE_BI = BigInt.fromI32(1);
let ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
let RAMP_ADS = "0xb69c2f1ceb9e8eca8b40cd0935e3160ecb065ec5";

export function handleCreateGauge(event: CreateGauge): void {
  let ramp = Ramp.load(event.params.ramp.toHexString());
  if (ramp === null) {
    ramp = new Ramp(event.params.ramp.toHexString());
    ramp.collectionId = event.params.collectionId.toString();
    ramp.rampAddress = event.params.ramp.toHexString();
    ramp.owner = event.params.owner.toHexString();
    ramp.likes = ZERO_BI;
    ramp.dislikes = ZERO_BI;
    ramp.save();
  }
  ramp.collectionId = event.params.collectionId.toString();
  ramp.owner = event.params.owner.toHexString();
  ramp.likes = ZERO_BI;
  ramp.dislikes = ZERO_BI;
  ramp.save();
}

export function handlePreMint(event: PreMint): void {
  let session = Session.load(event.params.sessionId + '-' + event.params.ramp.toHexString());
  if (session === null) {
    session = new Session(event.params.sessionId + '-' + event.params.ramp.toHexString());
    session.ramp = event.params.ramp.toHexString();
    session.user = event.params.user.toHexString();
    session.sessionId = event.params.sessionId;
    session.tokenAddress = event.params.tokenAddress.toHexString();
    session.amount = toBigDecimal(event.params.amount, 0);
    session.identityTokenId = event.params.identityTokenId.toString();
    session.active = true;
    session.mintSession = true;
    session.save();
  }
}

export function handleUpdateRampInfo(event: UpdateRampInfo): void {
  let ramp = Ramp.load(event.params.ramp.toHexString());
  if (ramp !== null) {
    ramp.applicationLink = event.params.applicationLink;
    ramp.publishableKeys = event.params.publishableKeys;
    ramp.description = event.params.description;
    ramp.profileId = event.params.profileId;
    ramp.secretKeys = event.params.secretKeys;
    ramp.clientIds = event.params.clientIds;
    ramp.avatar = event.params.avatar;
    ramp.channels = event.params.channels;
    ramp.save();
  }
}

export function handleCreateProtocol(event: CreateProtocol): void {
  let token = Token.load(event.params.token.toHexString() + '-' + event.params.ramp.toHexString());
  if (token === null) {
    token = new Token(event.params.token.toHexString() + '-' + event.params.ramp.toHexString());
    token.ramp = event.params.ramp.toHexString();
    token.addedToTokenSet = false;
    token.tokenAddress = event.params.token.toHexString()
    token.save();
  }
}

export function handleAddToken(event: AddToken): void {
  let token = Token.load(event.params.dtoken.toHexString() + '-' + ZERO_ADDRESS);
  if (token === null) {
      token = new Token(event.params.dtoken.toHexString() + '-' + ZERO_ADDRESS);
      token.addedToTokenSet = true;
      token.tokenAddress = event.params.dtoken.toHexString()
      token.save();
  }
}

export function handleRemoveToken(event: RemoveToken): void {
  let token = Token.load(event.params.dtoken.toHexString() + '-' + ZERO_ADDRESS);
  if (token !== null) {
      token.addedToTokenSet = false;
      token.save();
  }
}

export function handleDeleteProtocol(event: DeleteProtocol): void {
  let token = Token.load(event.params.token.toHexString() + '-' + event.params.ramp.toHexString());
  if (token !== null) {
      token.ramp = null;
      token.save();
  }
}

export function handleClaimPendingRevenue(event: ClaimPendingRevenue): void {
   // Transaction
   let transaction = new Transaction(event.transaction.hash.toHex());

   transaction.block = event.block.number;
   transaction.timestamp = event.block.timestamp;
   transaction.ramp = event.params.ramp.toHexString();
   transaction.token = event.params.token.toHexString();
   transaction.user = event.params.user.toHexString();   
   transaction.txType = "Claim";
   transaction.save();
 }

export function handleMint(event: Mint): void {
  let session = Session.load(event.params.sessionId + '-' + event.params.ramp.toHexString());
  if (session !== null) {
      session.active = false;
      session.save();
  }
  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.ramp = event.params.ramp.toHexString();
  transaction.token = event.params.token.toHexString();
  transaction.user = event.params.to.toHexString();   
  transaction.netPrice = toBigDecimal(event.params.amount, 0);   
  transaction.txType = "Mint";
  transaction.save();
}

export function handlePostMint(event: PostMint): void {
  let session = Session.load(event.params.sessionId);
  if (session !== null) {
    if (event.params.user.equals(Address.fromString(session.user))) {
      session.active = false;
      session.save()
    }
  }
}

export function handleBurn(event: Burn): void {
  let session = new Session(event.transaction.hash.toHex());
  session.ramp = event.params.ramp.toHexString();
  session.user = event.params.to.toHexString();
  session.sessionId = event.transaction.hash.toHex();
  session.tokenAddress = event.params.token.toHexString();
  session.amount = toBigDecimal(event.params.amount, 18);
  session.active = true;
  session.mintSession = false;
  session.save();

  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.ramp = event.params.ramp.toHexString();
  transaction.token = event.params.token.toHexString();
  transaction.user = event.params.to.toHexString();   
  transaction.netPrice = toBigDecimal(event.params.amount, 0);   
  transaction.txType = "Burn";
  transaction.save();
}

export function handleVoted(event: Voted): void {
  let ramp = Ramp.load(event.params.ramp.toHexString());
  if (ramp !== null) {
    let vote = Vote.load(event.params.ramp.toHexString() + "-" + event.params.profileId.toString());
    if (vote === null) {
      vote = new Vote(event.params.ramp.toHexString() + "-" + event.params.profileId.toString());
      vote.profileId = event.params.profileId;
      vote.createdAt = event.block.timestamp;
      vote.ramp = ramp.id;
    }
    vote.updatedAt = event.block.timestamp;
    vote.liked = event.params.like;
    vote.save();
    ramp.likes = event.params.likes;
    ramp.dislikes = event.params.dislikes;
    ramp.save();
  }
}

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {
  log.warning("zero_bi===============> - #{}", [event.params.idx.equals(ONE_BI) ? "true" : "false"]);
  if (event.params.idx.equals(ONE_BI) && event.params.sender.equals(Address.fromString(RAMP_ADS))) {
    let note = NFT.load(event.params.paramValue2.toString());
    if (note === null) {
      note = new NFT(event.params.paramValue2.toString());
      note.createdAt = event.block.timestamp;
    }
    note.updatedAt = event.block.timestamp;
    note.profileId = event.params.collectionId;
    note.tokenAddress = event.params.paramValue4.toHexString();
    let uri = fetchNoteURI(Address.fromString(RAMP_ADS), event.params.paramValue2);
    log.warning("uri2===============> - #{}", [uri]);
    if (uri !== null) {
      note.metadataUrl = uri;
    }
    note.save();
  }
}

export function handleLinkAccount(event: LinkAccount): void {
  let account = Account.load(event.params.accountId);
  if (account === null) {
    account = new Account(event.params.accountId);
    account.owner = event.params.owner.toHexString();
    account.active = true;
  }
  account.channel = event.params.channel;
  account.owner = event.params.owner.toHexString();
  account.moreInfo = event.params.moreInfo;
  account.timestamp = event.block.timestamp;
  if (event.params.owner.equals(Address.fromString(ZERO_ADDRESS))) {
    account.active = false;
  }
  account.save();
}