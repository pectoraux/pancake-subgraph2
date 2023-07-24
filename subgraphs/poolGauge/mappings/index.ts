/* eslint-disable prefer-const */
import { Pair, Account } from "../generated/schema";
import { toBigDecimal } from "./utils";
import {
  Deposit,
  Withdraw,
} from "../generated/PoolGauge/PoolGauge";


export function handleDeposit(event: Deposit): void {
  let pair = Pair.load(event.params.token.toHexString());
  if (pair === null) {
    pair = new Pair(event.params.token.toHexString());
    pair.timestamp = event.block.timestamp;
    pair.save();
  }
  let account = Account.load(event.params.ve.toHexString() + '-' + event.params.tokenId.toString());
  if (account === null) {
    account = new Account(event.params.ve.toHexString() + '-' + event.params.tokenId.toString());
    account.ve = event.params.ve.toHexString();
    account.tokenId = event.params.tokenId;
    account.owner = event.params.from.toHexString();
    account.amount = toBigDecimal(event.params.amount, 0);
    account.pair = event.params.token.toHexString();
    account.save();
  }
  account.amount = account.amount.plus(toBigDecimal(event.params.amount, 0));
  account.save();
}

export function handleWithdraw(event: Withdraw): void {
  let account = Account.load(event.params.ve.toHexString() + '-' + event.params.tokenId.toString());
  if (account !== null) {
    account.owner = event.params.from.toHexString();
    account.amount = account.amount.minus(toBigDecimal(event.params.amount, 0));
    account.save();
  }
}