/* eslint-disable prefer-const */
import { Address, BigInt, BigDecimal, log } from "@graphprotocol/graph-ts";
import { Valuepool, Transaction, Sponsor, Loan, Token, Purchase, Tag } from "../generated/schema";
import {
  CreateVava,
  NotifyLoan,
  NotifyReimbursement,
  NotifyPayment,
  ExecuteNextPurchase,
  Deposit,
  Withdraw,
  Delete,
  WithdrawFromVava,
  Initialize,
  Supply,
  AddCredit,
  UpdateParameters,
  AddSponsor,
  RemoveSponsor,
  CheckRank,
  SetParams,
  UpdateMiscellaneous,
} from "../generated/VavaHelper/VavaHelper";
import { toBigDecimal } from "./utils";
import { fetchTokenURI } from "./utils/erc721";

// Constants
let ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
let ZERO_BI = BigInt.fromI32(0);
let ZERO_BD = BigDecimal.fromString("0");

export function handleCreateVava(event: CreateVava): void {
  let valuepool = Valuepool.load(event.params.vava.toHexString());
  if (valuepool === null) {
    valuepool = new Valuepool(event.params.vava.toHexString());
    valuepool.active = true;
    valuepool.bnpl = false;
    valuepool.riskpool = event.params.riskpool;
    valuepool.tokenAddress = event.params.tokenAddress.toHexString();
    valuepool.devaddr_ = event.params.devaddr_.toHexString();
    valuepool.onePersonOneVote = event.params.onePersonOneVote;
    valuepool.timestamp = event.block.timestamp;
    valuepool.save();
  }
  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.valuepool = valuepool.id;
  transaction.txType = "New";
  transaction.save();
}

export function handleInitialize(event: Initialize): void {
  let valuepool = Valuepool.load(event.params.vava.toHexString());
  if (valuepool !== null) {
    valuepool.ve = event.params.ve.toHexString();
    valuepool.initialized = true;
    valuepool.save();
  }
}

export function handleAddCredit(event: AddCredit): void {
  let token = Token.load(event.params.va.toHexString() + '-' + event.params.tokenId.toString());
  if (token !== null) {
    token.owner = event.params.user.toHexString();
    token.vavaPercentile = event.params.percentile;
    token.save()
  }
}

export function handleUpdateParameters(event: UpdateParameters): void {
  let valuepool = Valuepool.load(event.params.vava.toHexString());
  if (valuepool !== null) {
    valuepool.bnpl = event.params.bnpl;
    valuepool.queueDuration = event.params.queueDuration;
    valuepool.minReceivable = event.params.minReceivable;
    valuepool.maxDueReceivable = event.params.maxDueReceivable;
    valuepool.treasuryShare = event.params.treasuryShare;
    valuepool.maxWithdrawable = event.params.maxWithdrawable;
    valuepool.lenderFactor = event.params.lenderFactor;
    valuepool.minimumSponsorPercentile = event.params.minimumSponsorPercentile;
    valuepool.save();
  }
}

export function handleSupply(event: Supply): void {
  let valuepool = Valuepool.load(event.params.vava.toHexString());
  if (valuepool !== null) {
    valuepool.veBalance = toBigDecimal(event.params.supply, 0);
    valuepool.save();
  }
}

export function handleWithdrawFromVa(event: Withdraw): void {
  let token = Token.load(event.params.va.toHexString() + '-' + event.params.tokenId.toString());
  if (token !== null) {
    token = new Token(event.params.va.toHexString() + '-' + event.params.tokenId.toString());
    token.vePercentile = event.params.percentile;
    token.owner = event.params.owner.toHexString();
    token.lockAmount = token.lockAmount.minus(toBigDecimal(event.params.value,0));
    token.updatedAt = event.block.timestamp;
    token.save();
  }

  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.veAddress = event.params.va.toHexString();
  transaction.tokenId = event.params.tokenId;
  transaction.user = event.params.owner.toHexString();
  transaction.netPrice = toBigDecimal(event.params.value, 0);
  transaction.txType = "VaWithdrawal";
  transaction.save(); 
}

export function handleWithdrawFromVava(event: WithdrawFromVava): void {
  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.netPrice = toBigDecimal(event.params.amount, 0);
  transaction.valuepool = event.params.vava.toHex();
  transaction.txType = "VavaWithdrawal";
  transaction.save();
}

export function handleDeposit(event: Deposit): void {
  log.warning("handleDeposit===============> - #{}", ['1']);
  let token = Token.load(event.params.va.toHexString() + '-' + event.params.tokenId.toString());
  if (token === null) {
    token = new Token(event.params.va.toHexString() + '-' + event.params.tokenId.toString());
    token.createAt = event.block.timestamp;
    token.lockAmount = ZERO_BD;
  }
  token.vePercentile = event.params.percentile;
  token.owner = event.params.owner.toHexString();
  token.valuepool = event.params.vava.toHexString();
  token.tokenId = event.params.tokenId;
  token.lockAmount = token.lockAmount.plus(toBigDecimal(event.params.value,0));
  token.lockValue = toBigDecimal(event.params.balanceOf,0)
  token.lockTime = event.params.lockTime;
  token.updatedAt = event.block.timestamp;
  let uri = fetchTokenURI(Address.fromString(event.params.va.toHexString()), event.params.tokenId);
  log.warning("uri2===============> - #{}", [uri]);
  if (uri !== null) {
    token.metadataUrl = uri;
  }
  token.save();

  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.tokenId = event.params.tokenId;
  transaction.depositType = event.params.deposit_type;
  transaction.locktime = event.params.lockTime;
  transaction.veAddress = event.params.va.toHexString();
  transaction.netPrice = toBigDecimal(event.params.value, 0);
  transaction.txType = "VaDeposit";
  transaction.save();
}

export function handleExecuteNextPurchase(event: ExecuteNextPurchase): void {
  let valuepool = Valuepool.load(event.params.vava.toHexString());
  if (valuepool !== null) {
    if (valuepool.bnpl) {
      let loan = Loan.load(event.params.vava.toHexString() + '-' + event.params.user.toHexString());
      if (loan === null ) {
        loan = new Loan(event.params.vava.toHexString() + '-' + event.params.user.toHexString());
        loan.active = event.params.amount.gt(ZERO_BI);
        loan.borrower = event.params.user.toHexString();
        loan.amount = toBigDecimal(event.params.amount, 0);
        loan.createAt = event.block.timestamp;
        loan.updatedAt = event.block.timestamp;
        loan.valuepool = event.params.vava.toHexString();
        loan.tokenId = event.params.tokenId;
        loan.loanType = "BNPL";
        loan.save();
      }
    }
    let purchase = Purchase.load(event.params.vava.toHexString() + '-' + event.params.tokenId.toString());
    if (purchase !== null) {
      purchase.active = false;
      purchase.save();
    }
    // Transaction
    let transaction = new Transaction(event.transaction.hash.toHex());

    transaction.block = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.valuepool = event.params.vava.toHex();
    transaction.user = event.params.user.toHexString();
    transaction.rank = event.params.rank;
    transaction.netPrice = toBigDecimal(event.params.amount, 0);
    transaction.txType = "Purchase";
    transaction.save();
  }
}

export function handleNotifyLoan(event: NotifyLoan): void {
  let loan = Loan.load(event.params.vava.toHexString() + '-' + event.params.borrower.toHexString());
  if (loan === null) {
    loan = new Loan(event.params.vava.toHexString() + '-' + event.params.borrower.toHexString());
    loan.active = event.params.amount.gt(ZERO_BI);
    loan.amount = toBigDecimal(event.params.amount, 0);
    loan.valuepool = event.params.vava.toHexString();
    loan.borrower = event.params.borrower.toHexString();
    loan.token = event.params.token.toHexString();
    loan.createAt = event.block.timestamp;
    loan.updatedAt = event.block.timestamp;
    loan.loanType = "CBC";
    loan.save();
  }
  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.valuepool = event.params.vava.toHex();
  transaction.user = event.params.borrower.toHexString();
  transaction.netPrice = toBigDecimal(event.params.amount, 0);
  transaction.txType = "VavaLoan";
  transaction.save();
}

export function handleNotifyReimbursement(event: NotifyReimbursement): void {
  let loan = Loan.load(event.params.vava.toHexString() + '-' + event.params.borrower.toHexString());
  if (loan !== null) {
    loan.amount = loan.amount.minus(toBigDecimal(event.params.amount,0));
    loan.active = event.params.active;
    loan.updatedAt = event.block.timestamp;
    if (!loan.active) {
      loan.valuepool = ZERO_ADDRESS;
    }
    loan.save();
  }
  // Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.valuepool = event.params.vava.toHex();
  transaction.user = event.params.borrower.toHexString();
  transaction.netPrice = toBigDecimal(event.params.amount, 0);
  transaction.txType = "VavaReimbursement";
  transaction.save();
}

export function handleAddSponsor(event: AddSponsor): void {
  let sponsor = Sponsor.load(event.params.vava.toHexString() + '-' + event.params.card.toHexString());
  if (sponsor === null) {
    sponsor = new Sponsor(event.params.vava.toHexString() + '-' + event.params.card.toHexString());
    sponsor.active = true;
    sponsor.geoTag = event.params.geoTag;
    sponsor.valuepool = event.params.vava.toHexString();
    sponsor.save()
  }
}

export function handleRemoveSponsor(event: RemoveSponsor): void {
  let sponsor = Sponsor.load(event.params.vava.toHexString() + '-' + event.params.card.toHexString());
  if (sponsor !== null) {
    sponsor.active = false;
    sponsor.valuepool = ZERO_ADDRESS
    sponsor.save()
  }
}

export function handleNotifyPayment(event: NotifyPayment): void {
  let valuepool = Valuepool.load(event.params.vava.toHexString());
  if (valuepool !== null) {
      let sponsor = Sponsor.load(event.params.vava.toHexString() + '-' + event.params.card.toHexString());
    if (sponsor !== null) {
      sponsor.updatedAt = event.block.timestamp;
      sponsor.card = event.params.card.toHexString();
      sponsor.percentile = event.params.percentile;
      sponsor.amount = sponsor.amount.plus(toBigDecimal(event.params.amount, 0));
      sponsor.save()
    }
    
    // Transaction
    let transaction = new Transaction(event.transaction.hash.toHex());

    transaction.block = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.valuepool = event.params.vava.toHex();
    transaction.user = event.params.card.toHexString();
    transaction.netPrice = toBigDecimal(event.params.amount, 0);
    transaction.txType = "SponsorPayment";
    transaction.save();
  }
}

export function handleDelete(event: Delete): void {
  let valuepool = Valuepool.load(event.params.vava.toHexString());
  if (valuepool !== null) {
    valuepool.active = false;
    valuepool.save();
  }
}

export function handleSetParams(event: SetParams): void {
  let valuepool = Valuepool.load(event.params.vava.toHexString());
  if (valuepool !== null) {
    valuepool.veName = event.params.name;
    valuepool.veSymbol = event.params.symbol;
    valuepool.veDecimals = BigInt.fromI32(event.params.decimals);
    valuepool.maxSupply = event.params.maxSupply;
    valuepool.minToSwitch = event.params.minToSwitch;
    valuepool.minTicketPrice = event.params.minTicketPrice;
    valuepool.save();
  }
}

export function handleCheckRank(event: CheckRank): void {
  let valuepool = Valuepool.load(event.params.vava.toHexString());
  if (valuepool !== null) {
    let purchase = Purchase.load(event.params.vava.toHexString() + '-' + event.params.tokenId.toString());
    if (purchase === null) {
      purchase = new Purchase(event.params.vava.toHexString() + '-' + event.params.tokenId.toString());
    }
    purchase.collection = event.params.collection.toHexString();
    purchase.from = event.params.from.toHexString();
    purchase.referrer = event.params.referrer.toHexString();
    purchase.productId = event.params.productId;
    purchase.options = event.params.options;
    purchase.userTokenId = event.params.userTokenId;
    purchase.identityTokenId = event.params.identityTokenId;
    purchase.tokenId = event.params.tokenId;
    purchase.price = toBigDecimal(event.params.price,0);
    purchase.rank = event.params.rank;
    purchase.epoch = event.params.epoch;
    purchase.valuepool = event.params.vava.toHexString();
    purchase.timestamp = event.block.timestamp;
    purchase.updatedAt = event.block.timestamp;
    purchase.active = true;
    purchase.save();
  }
}

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {
  if (event.params.idx.equals(ZERO_BI)) {
  let token = Token.load(event.params.paramValue4.toHexString() + '-' + event.params.collectionId.toString());
    if (token !== null) {
      if (event.params.sender.equals(Address.fromString(token.owner))) {
        token.countries = event.params.paramName;
        token.cities = event.params.paramValue;
        token.products = event.params.paramValue5;
        token.save();
        let tag = Tag.load('tags');
        if (tag === null) {
          tag = new Tag('tags');
          tag.createdAt = event.block.timestamp;
          tag.name = event.params.paramValue5;
        } else {
          tag.name = tag.name + ',' + event.params.paramValue5;
        }
        tag.updatedAt = event.block.timestamp;
        tag.save();
      }
    }
  }
}