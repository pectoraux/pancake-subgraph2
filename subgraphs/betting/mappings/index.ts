/* eslint-disable prefer-const */
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { BettingEvent, Betting, Ticket, Period } from "../generated/schema";
import {
  BettingResultsIn,
  CreateBetting,
  UpdateProtocol,
  DeleteProtocol,
  CloseBetting,
  DeleteBetting,
  UpdateMiscellaneous,
  TicketsClaim,
  TicketsPurchase,
  InjectFunds,
} from "../generated/betting/betting";
import { fetchTokenURI } from "./utils/erc721";

let ZERO_BI = BigInt.fromI32(0);
let BETTING_MINTER = "0xa322f9253ff045db7df5ca058a7e544f7ad514df";

export function handleUpdateProtocol(event: UpdateProtocol): void {
  let bettingEvent = BettingEvent.load(event.params.betting.toHexString() + '_' + event.params.currentBettingId.toString());
  if (bettingEvent === null) {
    bettingEvent = new BettingEvent(event.params.betting.toHexString() + '_' + event.params.currentBettingId.toString());
    bettingEvent.active = true;
    bettingEvent.token = event.params.token.toHexString();
    bettingEvent.action = event.params.action;
    bettingEvent.startTime = event.params.startTime;
    bettingEvent.adminShare = event.params.adminShare;
    bettingEvent.referrerShare = event.params.referrerShare;
    bettingEvent.bracketDuration = event.params.bracketDuration;
    bettingEvent.pricePerTicket = event.params.pricePerTicket;
    bettingEvent.discountDivisor = event.params.discountDivisor;
    bettingEvent.bettingId = event.params.currentBettingId;
    bettingEvent.betting = event.params.betting.toHexString();
    bettingEvent.rewardsBreakdown = event.params.rewardsBreakdown;
    bettingEvent.save();
  }
  if (bettingEvent.startTime === ZERO_BI || bettingEvent.startTime > event.block.timestamp) {
      bettingEvent.startTime = event.params.startTime;
  }
  bettingEvent.description = event.params.description;
  bettingEvent.media = event.params.media;
  bettingEvent.save();
}

export function handleBettingResultsIn(event: BettingResultsIn): void {
  let bettingEvent = BettingEvent.load(event.params.betting.toHexString() + '_' + event.params.bettingId.toString());
  if (bettingEvent !== null) {
    let period = Period.load(event.params.betting.toHexString() + '_' + event.params.bettingId.toString() + '_' + event.params.period.toString());
    if (period === null) {
      period = new Period(event.params.betting.toHexString() + '_' + event.params.bettingId.toString() + '_' + event.params.period.toString());
      period.period = event.params.period;
      period.bettingEvent = bettingEvent.id;
      period.amountCollected = ZERO_BI;
    }
    period.status = "Claimable";
    period.auditor = event.params.auditor.toHexString();
    period.finalNumber = event.params.finalNumber;
    period.save();
  }
}

export function handleTicketsPurchase(event: TicketsPurchase): void {
  let bettingEvent = BettingEvent.load(event.params.betting.toHexString() + '_' + event.params.bettingId.toString());
  if (bettingEvent !== null) {
    let ticket = Ticket.load(event.params.ticketId.toString());
    if (ticket === null) {
      ticket = new Ticket(event.params.ticketId.toString());
      ticket.owner = event.params.user.toHexString();
      ticket.ticketNumber = event.params.ticketNumber;
      ticket.rewards = event.params.amount;
      ticket.bettingEvent = bettingEvent.id;
      let uri = fetchTokenURI(Address.fromString(BETTING_MINTER), event.params.ticketId);
      ticket.metadataUrl = uri;
      ticket.save();
    }
    let period = Period.load(event.params.betting.toHexString() + '_' + event.params.bettingId.toString() + '_' + event.params.period.toString());
    if (period === null) {
      period = new Period(event.params.betting.toHexString() + '_' + event.params.bettingId.toString() + '_' + event.params.period.toString());
      period.status = "Open";
      period.period = event.params.period;
      period.bettingEvent = bettingEvent.id;
      period.amountCollected = ZERO_BI;
      period.save();
    }
    period.amountCollected = period.amountCollected.plus(event.params.amount)
    period.save()
  }
}

export function handleInjectFunds(event: InjectFunds): void {
  let period = Period.load(event.params.betting.toHexString() + '_' + event.params.bettingId.toString() + '_' + event.params.period.toString());
  if (period !== null) {
    period.amountCollected = period.amountCollected.plus(event.params.amount)
    period.save()
  }
}

export function handleTicketsClaim(event: TicketsClaim): void {
  let bettingEvent = BettingEvent.load(event.params.betting.toHexString() + '_' + event.params.bettingId.toString());
  if (bettingEvent !== null) {
    let ticket = Ticket.load(event.params.ticketNumber.toString());
    if (ticket !== null) {
      ticket.claimed = true;
      let uri = fetchTokenURI(Address.fromString(BETTING_MINTER), event.params.ticketNumber);
      log.warning("uri===============> - #{}", [uri]);
      ticket.metadataUrl = uri;
      ticket.save();
    }
  }
}

export function handleCloseBetting(event: CloseBetting): void {
  let bettingEvent = BettingEvent.load(event.params.betting.toHexString() + '_' + event.params.bettingId.toString());
  if (bettingEvent !== null) {
    let period = Period.load(event.params.betting.toHexString() + '_' + event.params.bettingId.toString() + '_' + event.params.period.toString());
    if (period !== null) {
      period.status = "Close";
      period.closedAt = event.block.timestamp;
      period.save()
    }
    bettingEvent.save();
  }
}

export function handleDeleteProtocol(event: DeleteProtocol): void {
  let bettingEvent = BettingEvent.load(event.params.betting.toHexString() + '_' + event.params.protocolId.toString());
  if (bettingEvent !== null) {
    bettingEvent.active = false;
    bettingEvent.betting = '';
    bettingEvent.save();
  }
}

export function handleDeleteBetting(event: DeleteBetting): void {
  let betting = Betting.load(event.params.betting.toHexString());
  if (betting !== null) {
    betting.active = false;
    betting.save();
  }
}

export function handleCreateBetting(event: CreateBetting): void {
  let betting = Betting.load(event.params.betting.toHexString());
  if (betting === null) {
    betting = new Betting(event.params.betting.toHexString());
    betting.active = true;
    betting.owner = event.params._user.toHexString();
    betting.profileId = event.params.profileId;
    betting.save();
  }
}

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {
  if (event.params.idx.equals(ZERO_BI)) {
    let betting = Betting.load(event.params.paramValue4.toHex());
    if (betting !== null && event.params.sender.equals(Address.fromString(betting.owner)) ) {
    }
  }
}