/* eslint-disable prefer-const */
import { Address, BigInt, log  } from "@graphprotocol/graph-ts";
import { Stake, Transaction, Token, Tag } from "../generated/schema";
import {
  AddToStake,
  CancelStake,
  UnlockStake,
  ApplyToStake,
  StakeCreated,
  UpdateMiscellaneous,
  UpdateRequirements
} from "../generated/StakeMarket/StakeMarket";
import { toBigDecimal } from "./utils";
import { fetchTokenURI } from "./utils/erc721";

let ONE_BI = BigInt.fromI32(1);
let STAKEMARKET_HELPER = "0xf178d8a6661aba43beafe98080e47cd213c2fc34";

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {  
  log.warning("handleUpdateMiscellaneous===============> - #{}", [event.params.paramValue2.toString() + "-" + event.params.paramValue]);
  if (event.params.idx.equals(ONE_BI)) {
    let stake = Stake.load(event.params.collectionId.toString());
    if (stake !== null) {
      let token =  Token.load(event.params.paramValue2.toString());
      if (token === null) {
        token = new Token(event.params.paramValue2.toString());
      }
      token.stake = stake.id;
      token.timestamp = event.block.timestamp;
      let uri = fetchTokenURI(Address.fromString(STAKEMARKET_HELPER), event.params.paramValue2);
      if (uri !== null) {
        token.metadataUrl = uri;
        log.warning("uri1===============> - #{}", [uri]);
      }
      token.save();
    }
  }
}

export function handleStakeCreated(event: StakeCreated): void {
  let stake = Stake.load(event.params.stakeId.toString());
  if (stake === null) {
    stake = new Stake(event.params.stakeId.toString());
    stake.stakeSource = event.params.stakeSource;
    stake.owner = event.params.owner.toHexString();
    stake.active = true;
    stake.timestamp = event.params.time;
    stake.save();
  }
  stake.stakeSource = event.params.stakeSource;
  stake.save();
  
  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.stake = event.params.stakeId.toString();
  transaction.txType = "New";
  transaction.save();
}

export function handleUpdateRequirements(event: UpdateRequirements): void {
  let stake = Stake.load(event.params.stakeId.toString());
  if (stake !== null) {
    if (stake.terms === null) {
      stake.terms = event.params.terms;
    }
    stake.cities = event.params.cities;
    stake.countries = event.params.countries;
    stake.products = event.params.products;
    stake.save();
    let tag = Tag.load('tags');
    if (tag === null) {
      tag = new Tag('tags');
      tag.createdAt = event.block.timestamp;
      tag.name = event.params.products;
    } else {
      tag.name = tag.name + ',' + event.params.products;
    }
    tag.updatedAt = event.block.timestamp;
    tag.save();
  }
}

export function handleApplyToStake(event: ApplyToStake): void {
  let stake = Stake.load(event.params.stakeId.toString());
  if (stake !== null) {
    stake.appliedTo = event.params.partnerStakeId.toString();
    stake.save();
  }
  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.stake = event.params.stakeId.toString();
  transaction.txType = "Application";
  transaction.save(); 
}

export function handleAddToStake(event: AddToStake): void {
  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.netPrice = toBigDecimal(event.params.amount, 18);
  transaction.stake = event.params.stakeId.toString();
  transaction.txType = "AddToStake";
  transaction.save();
}

export function handleUnlockStake(event: UnlockStake): void {
  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.netPrice = toBigDecimal(event.params.amount, 18);
  transaction.stake = event.params.stakeId.toString();
  transaction.txType = "UnlockFromStake";
  transaction.save();
}

export function handleCancelStake(event: CancelStake): void {
  let stake = Stake.load(event.params.stakeId.toString());
  if (stake !== null) {
    stake.active = false;
    stake.save();
  }
  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.stake = event.params.stakeId.toString();
  transaction.txType = "Cancel";
  transaction.save();
}