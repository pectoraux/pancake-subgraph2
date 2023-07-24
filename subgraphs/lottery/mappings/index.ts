/* eslint-disable prefer-const */
import { Lottery, User, History, Token } from "../generated/schema";
import {
  LotteryClose,
  LotteryOpen,
  TicketsPurchase,
  LotteryNumberDrawn,
  TicketsClaim,
} from "../generated/lottery/lottery";

export function handleLotteryOpen(event: LotteryOpen): void {
  let lottery = Lottery.load(event.params.lotteryId.toString());
  if (lottery === null) {
    lottery = new Lottery(event.params.lotteryId.toString());
    lottery.active = true;
    lottery.treasuryFee = event.params.treasuryFee;
    lottery.referrerFee = event.params.referrerFee;
    lottery.priceTicket = event.params.priceTicket;
    lottery.firstTicketId = event.params.firstTicketId;
    lottery.discountDivisor = event.params.discountDivisor;
    lottery.startTime = event.params.startTime;
    lottery.endTime = event.params.endTime;
    lottery.collectionId = event.params.collectionId;
    lottery.save();
  }
}

export function handleTicketsPurchase(event: TicketsPurchase): void {
  let lottery = Lottery.load(event.params.lotteryId.toString());
  if (lottery !== null) {
    let user = User.load(event.params.ticketId.toString());
    if (user === null) {
      user = new User(event.params.ticketId.toString());
    }
    user.ticketNumber = event.params.numberTicket;
    user.account = event.params.buyer.toHex();
    user.lottery = lottery.id;
    user.save();
  }
}

export function handleTicketsClaim(event: TicketsClaim): void {
  let lottery = Lottery.load(event.params.lotteryId.toString());
  if (lottery !== null) {
    let user = User.load(event.params.ticketId.toString());
    if (user === null) {
      user = new User(event.params.ticketId.toString());
    }
    user.account = event.params.claimer.toHex();
    let token = Token.load("ticket_" + event.params.ticketId.toString());
    if (token === null) {
      token = new Token("ticket_" + event.params.ticketId.toString());
      token.tokenAddress = event.params.token.toHex();
      token.value = event.params.amount;
      token.lottery = lottery.id;
      token.active = true;
      token.user = user.id;
      token.save();
    }
    user.save();
  }
}

export function handleLotteryClose(event: LotteryClose): void {
  let lottery = Lottery.load(event.params.lotteryId.toString());
  if (lottery !== null) {
    lottery.active = false;
    lottery.save();
    let history = History.load(event.params.lotteryId.toString());
    if (history === null) {
      history = new History(event.params.lotteryId.toString());
      history.lottery = lottery.id;
      history.createdAt = event.block.timestamp;
      history.updatedAt = event.block.timestamp;
      history.countWinnersPerBracket = event.params.countWinnersPerBracket;
      history.save();
    }
  }
}

export function handleLotteryNumberDrawn(event: LotteryNumberDrawn): void {
  let lottery = Lottery.load(event.params.lotteryId.toString());
  if (lottery !== null) {
    let history = History.load(event.params.lotteryId.toString());
    if (history !== null) {
      history.updatedAt = event.block.timestamp;
      history.finalNumber = event.params.finalNumber;
      history.numberOfWinningTickets = event.params.countWinningTickets;
      history.save();
    }
  }
}