/* eslint-disable prefer-const */
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Protocol, BILL, Vote, Note } from "../generated/schema";
import {
  Voted,
  UpdateAutoCharge,
  CreateBILL,
  UpdateProtocol,
  DeleteProtocol,
  DeleteBILL,
  UpdateMiscellaneous,
  TransferDueToNote,
} from "../generated/bills/billMinter";
import { fetchTokenURI, fetchNoteURI } from "./utils/erc721";

let ZERO_BI = BigInt.fromI32(0);
let BILL_MINTER = "0xa322f9253ff045db7df5ca058a7e544f7ad514df";
let BILL_NOTE = "0xe973f5705566dd65a3032c16e1dc3cb52dc8d753";

export function handleUpdateProtocol(event: UpdateProtocol): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.bill.toHex());
  if (protocol === null) {
    protocol = new Protocol(event.params.protocolId.toString() + '_' + event.params.bill.toHex());
    protocol.optionId = event.params.optionId;
    protocol.autoCharge = false;
    protocol.token = event.params.token.toHex();
  }
  let uri = fetchTokenURI(Address.fromString(BILL_MINTER), event.params.protocolId);
  if (uri !== null) {
    protocol.metadataUrl = uri;
    log.warning("uri1===============> - #{}", [uri]);
  }
  protocol.active = true;
  protocol.owner = event.params.owner.toHex();
  protocol.bill = event.params.bill.toHex();
  protocol.description = event.params.description;
  protocol.media = event.params.media;
  protocol.save();
}

export function handleUpdateAutoCharge(event: UpdateAutoCharge): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.bill.toHex());
  if (protocol !== null) {
    protocol.autoCharge = event.params.isAutoChargeable;
    protocol.save();
  }
}

export function handleDeleteProtocol(event: DeleteProtocol): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.bill.toHex());
  if (protocol !== null) {
    protocol.active = false;
    protocol.save();
  }
}

export function handleTransferDueToNote(event: TransferDueToNote): void {
  let bill = BILL.load(event.params.bill.toHex());
  if (bill !== null) {
    let note = Note.load(event.params.tokenId.toString());
    if (note === null) {
      note = new Note(event.params.tokenId.toString());
      note.createdAt = event.block.timestamp;
      note.updatedAt = event.block.timestamp;
    }
    let uri = fetchNoteURI(Address.fromString(BILL_NOTE), event.params.tokenId);
    if (uri !== null) {
      note.metadataUrl = uri;
      log.warning("uri1===============> - #{}", [uri]);
    }
    if (event.params.adminNote) {
      note.bill = bill.id;
      note.save();
    } else {
      let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.bill.toHex());
      if (protocol !== null) {
        note.protocol = protocol.id;
        note.save();
      }
    }
  }
}

export function handleDeleteBILL(event: DeleteBILL): void {
  let bill = BILL.load(event.params.bill.toHexString());
  if (bill !== null) {
    bill.active = false;
    bill.save();
  }
}

export function handleVoted(event: Voted): void {
  let bill = BILL.load(event.params.bill.toHex());
  if (bill !== null) {
      let vote = Vote.load(event.params.bill.toHex() + "-" + event.params.profileId.toString());
      if (vote === null) {
        vote = new Vote(event.params.bill.toHex() + "-" + event.params.profileId.toString());
        vote.profileId = event.params.profileId;
        vote.createdAt = event.block.timestamp;
        vote.bill = bill.id;
      }
      vote.updatedAt = event.block.timestamp;
      vote.liked = event.params.like;
      vote.save();
      bill.likes = event.params.likes;
      bill.dislikes = event.params.dislikes;
      bill.save();
  }
}

export function handleCreateBILL(event: CreateBILL): void {
  let bill = BILL.load(event.params.bill.toHex());
  if (bill === null) {
    bill = new BILL(event.params.bill.toHex());
    bill.profileId = event.params.profileId;
    bill.owner = event.params._user.toHexString();
    bill.likes = ZERO_BI;
    bill.dislikes = ZERO_BI;
    bill.save();
  }
}

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {
  if (event.params.idx.equals(ZERO_BI)) {
    let bill = BILL.load(event.params.paramValue4.toHex());
    if (bill !== null && event.params.sender.equals(Address.fromString(bill.owner)) ) {
      bill.applicationLink = event.params.paramName;
      bill.save();
    }
  }
}