/* eslint-disable prefer-const */
import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { Card, TokenBalance } from "../generated/schema";
import {
  AddBalance,
  ExecutePurchase,
  RemoveBalance,
  TransferBalance,
  UpdatePassword,
} from "../generated/cards/cards";
import { toBigDecimal } from "./utils";

let ZERO_BI = BigInt.fromString("0");

export function handleAddBalance(event: AddBalance): void {
  let card = Card.load(event.params._username);
  if (card !== null) {
    card.updatedAt = event.block.timestamp;
    card.username = event.params._username;
    let tokenBalance = TokenBalance.load(event.params._username + '_' + event.params.token.toHexString());
    if (tokenBalance === null) {
        tokenBalance = new TokenBalance(event.params._username + '_' + event.params.token.toHexString());
        tokenBalance.createdAt = event.block.timestamp;
        tokenBalance.balance = ZERO_BI;
        tokenBalance.card = event.params._username;
        tokenBalance.tokenAddress = event.params.token.toHexString();
        }
    tokenBalance.updatedAt = event.block.timestamp;
    tokenBalance.balance = tokenBalance.balance.plus(event.params.amount);
    tokenBalance.save();
    card.save();
  }
}

export function handleRemoveBalance(event: RemoveBalance): void {
    let card = Card.load(event.params._username);
    if (card !== null) {
        let tokenBalance = TokenBalance.load(event.params._username + '_' + event.params.token.toHexString());
        if (tokenBalance !== null) {
            if (tokenBalance.balance.equals(event.params.amount)) {
                tokenBalance.id = '';
            }
            tokenBalance.balance = tokenBalance.balance.minus(event.params.amount);
            tokenBalance.updatedAt = event.block.timestamp;
        }
        tokenBalance.save();
        if (card.balances.length === 0) {
            card.active = false;
        }
        card.updatedAt = event.block.timestamp;
        card.save();
    }
}

export function handleTransferBalance(event: TransferBalance): void {
    let fromTokenBalance = TokenBalance.load(event.params.from + '_' + event.params.token.toHexString());
    let toTokenBalance = TokenBalance.load(event.params.to + '_' + event.params.token.toHexString());
    if (fromTokenBalance !== null && toTokenBalance !== null) {
        if (fromTokenBalance.balance.equals(event.params.amount)) {
            fromTokenBalance.id = '';
        }
        fromTokenBalance.balance = fromTokenBalance.balance.minus(event.params.amount);
        toTokenBalance.balance = toTokenBalance.balance.plus(event.params.amount);
        fromTokenBalance.updatedAt = event.block.timestamp;
        toTokenBalance.updatedAt = event.block.timestamp;
    }
    fromTokenBalance.save();
    toTokenBalance.save();
}

export function handleExecutePurchase(event: ExecutePurchase): void {
    let tokenBalance = TokenBalance.load(event.params._username + '_' + event.params.token.toHexString());
    if (tokenBalance !== null) {
        if (tokenBalance.balance.equals(event.params.price)) {
            tokenBalance.id = '';
        }
        tokenBalance.balance = tokenBalance.balance.gt(event.params.price) ? tokenBalance.balance.minus(event.params.price) : ZERO_BI;
        tokenBalance.updatedAt = event.block.timestamp;
    }
    tokenBalance.save();
}

export function handleUpdatePassword(event: UpdatePassword): void {
    let card = Card.load(event.params._username);
    if (card === null) {
        card = new Card(event.params._username);
        card.active = true;
        card.createdAt = event.block.timestamp;
    }
    card.password = event.params._password;
    card.updatedAt = event.block.timestamp;
    card.save();
}