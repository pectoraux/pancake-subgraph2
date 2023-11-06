/* eslint-disable prefer-const */
import { Address, BigDecimal, BigInt, log  } from "@graphprotocol/graph-ts";
import { 
  Collection, 
  Review,
  NFT, 
  Item,
  Task,
  Mirror,
  Protocol,
  PaywallMirror,
  PaywallARP,
  Paywall, 
  Trial,
  AskOrder, 
  Transaction, 
  User, 
  PriceReductor, 
  IdentityProof, 
  Registration,
  Announcement,
  Valuepool,
  PartnerRegistration,
  Vote,
  Option,
} from "../generated/schema";
import {
  AskInfo,
  PaywallAskNew,
  CreateReview,
  AskCancel,
  AskNew,
  AskUpdate,
  Trade,
  UpdateAutoCharge,
  UpdateProtocol,
  DeleteProtocol,
  UpdatePaywall,
  PaywallVoted,
  CreatePaywallARP,
  DeletePaywallARP,
  PaywallTrade,
  CollectionClose,
  CollectionNew,
  CollectionUpdate,
  AddReferral,
  CloseReferral,
  UpdateOptions,
  PaywallUpdateOptions,
  UserRegistration,
  PartnerRegistrationRequest,
  PaywallAskCancel,
  PaywallAskUpdate,
  AskUpdateIdentity,
  AskUpdateDiscount,
  AskUpdateCashback,
  UpdateTaskEvent,
  UpdateSubscriptionInfo,
  PaywallAskUpdateIdentity,
  PaywallAskUpdateDiscount,
  PaywallAskUpdateCashback,
  UpdateCollection,
  RevenueClaim,
  Voted,
  UpdateValuepools,
  UpdateAnnouncement,
  UpdateMiscellaneous,
} from "../generated/MarketPlace/MarketPlaceEvents";
import { toBigDecimal } from "./utils";
import { 
  updateCollectionDayData, 
  updateMarketPlaceDayData
 } from "./utils/dayUpdates";
 import { fetchTokenURI } from "./utils/erc721";

// Constants
let ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
let ITEM_ORDERS = "0xdc72352ea34141bf8f72aefca07b30acec155dcf";
let ITEM_HELPER = "0x0b252359e6f81694c11b5ba4782a9151e3e82579";
let ITEM_HELPER2 = "0x78c10070ac5e9aad679ccdf2d3be9a2f77ee5f11";
let NFT_ORDERS = "0x9cfe0aeb5f89e5f3a58c36498c42acdd278acbfc";
let NFT_HELPER = "0x352ae66dca43ad2c23d57393d6d5b5adf6b2446c";
let NFT_HELPER2 = "0xca00299befd8a4ff57ac83aefdb3f1701e7d5c2b";
let PAYWALL_ORDERS = "0x8e253b889a5c03d35bfc2a9e433dde4144236fba";
let PAYWALL_HELPER = "0x5e54677a9c2803481016e041a8cfeb3fd03770c6";
let PAYWALL_HELPER2 = "0x86973bebe9233792426bbb39d7e1356eb1211594";
let NFTICKET_HELPER2 = "0x517a113a03b7842c1b731b482e89fb4920363ad5";

// BigNumber-like references
let ZERO_BI = BigInt.fromI32(0);
let ONE_BI = BigInt.fromI32(1);
let TWO_BI = BigInt.fromI32(2);
let THREE_BI = BigInt.fromI32(3);
let FOUR_BI = BigInt.fromI32(4);
let FIVE_BI = BigInt.fromI32(5);
let SIX_BI = BigInt.fromI32(6);
let SEVEN_BI = BigInt.fromI32(7);
let EIGHT_BI = BigInt.fromI32(8);
let NINE_BI = BigInt.fromI32(9);
let ZERO_BD = BigDecimal.fromString("0");

/**
 * COLLECTION(S)
 */

 export function handleCollectionNew(event: CollectionNew): void {
  let collection = Collection.load(event.params.collectionId.toString());
  if (collection === null) {
    collection = new Collection(event.params.collectionId.toString());
    collection.active = true;
    collection.badgeId = event.params.badgeId
    collection.owner = event.params.collection.toHexString()
    collection.baseToken = event.params.baseToken.toHexString()
    collection.minBounty = event.params.minBounty
    collection.userMinBounty = event.params.userMinBounty
    collection.requestUserRegistration = event.params.requestUserRegistration
    collection.requestPartnerRegistration = event.params.requestPartnerRegistration
    collection.totalTrades = ZERO_BI;
    collection.totalVolumeBNB = ZERO_BD;
    collection.numberTokensListed = ZERO_BI;
    collection.numberPaywallsListed = ZERO_BI;
    collection.numberPartnerTokensListed = ZERO_BI;
    collection.numberPartnersListed = ZERO_BI;
    collection.numberPartnerNftsListed = ZERO_BI;
    collection.numberPartnerTokensListed = ZERO_BI;
    collection.numberPartnerPaywallsListed = ZERO_BI;
    collection.recurringBounty = event.params.recurringBounty
    collection.tradingFee = toBigDecimal(event.params.tradingFee, 2)
    collection.referrerFee = toBigDecimal(event.params.referrerFee, 2);
    collection.save();
  }
  collection.active = true;
  collection.badgeId = event.params.badgeId
  collection.minBounty = event.params.minBounty
  collection.baseToken = event.params.baseToken.toHexString()
  collection.userMinBounty = event.params.userMinBounty
  collection.requestUserRegistration = event.params.requestUserRegistration
  collection.requestPartnerRegistration = event.params.requestPartnerRegistration
  collection.recurringBounty = event.params.recurringBounty
  collection.tradingFee = toBigDecimal(event.params.tradingFee, 2)
  collection.owner = event.params.collection.toHexString()
  collection.referrerFee = toBigDecimal(event.params.referrerFee, 2);
  collection.save();
}

export function handleCollectionClose(event: CollectionClose): void {
  let collection = Collection.load(event.params.collection.toString());
  if (collection !== null) {
    collection.active = false;
    collection.save();
  }
}

export function handleCollectionUpdate(event: CollectionUpdate): void {
  let collection = Collection.load(event.params.collectionId.toString());
  if (collection !== null) {
    collection.badgeId = event.params.badgeId
    collection.minBounty = event.params.minBounty
    collection.userMinBounty = event.params.userMinBounty
    collection.recurringBounty = event.params.recurringBounty
    collection.owner = event.params.collection.toHexString()
    collection.requestUserRegistration = event.params.requestUserRegistration
    collection.requestPartnerRegistration = event.params.requestPartnerRegistration
    collection.tradingFee = toBigDecimal(event.params.tradingFee, 2)
    collection.referrerFee = toBigDecimal(event.params.referrerFee, 2);
    collection.save();
  }
}

/**
 * ASK ORDERS
 */

export function handleAskNew(event: AskNew): void {
  let collection = Collection.load(event.params._collectionId.toString());
  if (collection !== null) {
    let user = User.load(event.params._collectionId.toString());
    if (user === null) {
      user = new User(event.params._collectionId.toString());
      user = new User(event.params._collectionId.toString());
      user.numberTokensListed = ONE_BI;
      user.numberPaywallsListed = ZERO_BI;
      user.numberTokensPurchased = ZERO_BI;
      user.numberPaywallsPurchased = ZERO_BI;
      user.numberTokensSold = ZERO_BI;
      user.numberPaywallsSold = ZERO_BI;
      user.totalVolumeInBNBTokensPurchased = ZERO_BD;
      user.totalVolumeInBNBPaywallsPurchased = ZERO_BD;
      user.totalVolumeInBNBTokensSold = ZERO_BD;
      user.totalVolumeInBNBPaywallsSold = ZERO_BD;
      user.totalFeesCollectedInBNB = ZERO_BD;
      user.averageTokenPriceInBNBPurchased = ZERO_BD;
      user.averagePaywallPriceInBNBPurchased = ZERO_BD;
      user.averageTokenPriceInBNBSold = ZERO_BD;
      user.averagePaywallPriceInBNBSold = ZERO_BD;
      user.save();
    }
    user.numberTokensListed = user.numberTokensListed.plus(ONE_BI);
    user.save();

    collection.numberTokensListed = collection.numberTokensListed.plus(ONE_BI);
    collection.save();
    let token = Item.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (token === null) {
      token = new Item(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      token.behindPaywall = ZERO_BI;
      token.bountyId = ZERO_BI;
      token.badgeId = ZERO_BI;
      token.superLikes = ZERO_BI;
      token.superDisLikes = ZERO_BI;
      token.start = ZERO_BI;
      token.period = ZERO_BI;
      // token.metadataUrl = fetchTokenURI(event.params.collection, event.params.tokenId);
      token.latestTradedPriceInBNB = ZERO_BD;
      token.tradeVolumeBNB = ZERO_BD;
      token.behindPaywall = ZERO_BI;
      token.totalTrades = ZERO_BI;
      token.likes = ZERO_BI;
      token.disLikes = ZERO_BI;
      token.active = true;
      token.isTradable = true;
    }
    token.collection = event.params._collectionId.toString();
    token.tokenId = event.params._tokenId.toString();
    token.rsrcTokenId = event.params._rsrcTokenId;
    token.dropinTimer = event.params._dropinTimer;
    token.bidDuration = event.params._bidDuration;
    token.minBidIncrementPercentage = event.params._minBidIncrementPercentage;
    token.currentSeller = collection.owner;
    token.updatedAt = event.block.timestamp;
    token.maxSupply = event.params._maxSupply
    token.transferrable = event.params._transferrable;
    token.currentAskPrice = toBigDecimal(event.params._askPrice, 18);
    token.tFIAT = event.params._tFIAT.toHexString();
    token.usetFIAT = event.params._tFIAT.notEqual(Address.fromString(ZERO_ADDRESS));
    if (event.params._ve.notEqual(Address.fromString(ZERO_ADDRESS))) {
      token.ve = event.params._ve.toHexString();
    }
    token.save();

    let order = new AskOrder(event.transaction.hash.toHex());
    order.block = event.block.number;
    order.timestamp = event.block.timestamp;
    order.collection = event.params._collectionId.toString();
    order.item = token.id;
    order.orderType = "NewItem";
    order.askPrice = toBigDecimal(event.params._askPrice, 18);
    order.seller = user.id;
    order.save();
  }
}

export function handlePaywallAskNew(event: PaywallAskNew): void {
  let isPaywall = event.params._sender.equals(Address.fromString(PAYWALL_ORDERS))
  let isNFT = event.params._sender.equals(Address.fromString(NFT_ORDERS))
  log.warning("===============> - #{}", [event.params._sender.toHexString()]);
  log.warning("===============> - #{}", [isPaywall.toString()]);
  let concatId = event.params._collectionId.toString() + "-" + event.params._tokenId.toString();
  if (isPaywall || isNFT) {
    let collection = Collection.load(event.params._collectionId.toString());
    if (collection !== null) {
      let user = User.load(event.params._collectionId.toString());
      if (user === null) {
        user = new User(event.params._collectionId.toString());
        user.numberTokensListed = ZERO_BI;
        user.numberPaywallsListed = ONE_BI;
        user.numberNftsListed = ONE_BI;
        user.numberTokensPurchased = ZERO_BI;
        user.numberNftsPurchased = ZERO_BI;
        user.numberPaywallsPurchased = ZERO_BI;
        user.numberTokensSold = ZERO_BI;
        user.numberNftsSold = ZERO_BI;
        user.numberPaywallsSold = ZERO_BI;
        user.totalVolumeInBNBTokensPurchased = ZERO_BD;
        user.totalVolumeInBNBNftsPurchased = ZERO_BD;
        user.totalVolumeInBNBPaywallsPurchased = ZERO_BD;
        user.totalVolumeInBNBTokensSold = ZERO_BD;
        user.totalVolumeInBNBNftsSold = ZERO_BD;
        user.totalVolumeInBNBPaywallsSold = ZERO_BD;
        user.totalFeesCollectedInBNB = ZERO_BD;
        user.averageTokenPriceInBNBPurchased = ZERO_BD;
        user.averagePaywallPriceInBNBPurchased = ZERO_BD;
        user.averageNftPriceInBNBPurchased = ZERO_BD;
        user.averageTokenPriceInBNBSold = ZERO_BD;
        user.averagePaywallPriceInBNBSold = ZERO_BD;
        user.averageNftPriceInBNBSold = ZERO_BD;
        user.save();
      }
      if (isPaywall) {
        user.numberPaywallsListed = user.numberPaywallsListed.plus(ONE_BI);
        user.save();
        collection.numberPaywallsListed = collection.numberPaywallsListed.plus(ONE_BI);
        collection.save();
      } else {
        user.numberNftsListed = user.numberNftsListed.plus(ONE_BI);
        user.save();
        collection.numberNftsListed = collection.numberNftsListed.plus(ONE_BI);
        collection.save();
      }
      // let token;
      if (isPaywall) {
        let token = Paywall.load(concatId);
        if (token === null) {
          token = new Paywall(concatId);
          token.tokenId = event.params._tokenId.toString();
          token.collection = event.params._collectionId.toString();
          token.updatedAt = event.block.timestamp;
          token.currentAskPrice = toBigDecimal(event.params._askPrice, 18);
          token.transferrable = event.params._transferrable;
          token.maxSupply = event.params._maxSupply
          token.currentSeller = collection.owner;
          token.latestTradedPriceInBNB = ZERO_BD;
          token.tradeVolumeBNB = ZERO_BD;
          token.totalTrades = ZERO_BI;
          token.isTradable = true;
          token.canPublish = false;
          token.active = true;
          token.likes = ZERO_BI;
          token.disLikes = ZERO_BI;
          token.bountyId = ZERO_BI;
          token.badgeId = ZERO_BI;
          token.dropinTimer = ZERO_BI;
          token.bidDuration = ZERO_BI;
          token.minBidIncrementPercentage = ZERO_BI;
          token.rsrcTokenId = ZERO_BI;
          token.superLikes = ZERO_BI;
          token.superDisLikes = ZERO_BI;
          token.start = ZERO_BI;
          token.period = ZERO_BI;
          if (event.params._ve.notEqual(Address.fromString(ZERO_ADDRESS))) {
            token.ve = event.params._ve.toHexString();
          }
          token.tFIAT = event.params._tFIAT.toHexString();
          token.usetFIAT = event.params._tFIAT.notEqual(Address.fromString(ZERO_ADDRESS));
          token.save();
        }  else {
          token.currentSeller = collection.owner;
          token.updatedAt = event.block.timestamp;
          token.maxSupply = event.params._maxSupply
          token.transferrable = event.params._transferrable;
          token.currentAskPrice = toBigDecimal(event.params._askPrice, 18);
          if (event.params._ve.notEqual(Address.fromString(ZERO_ADDRESS))) {
            token.ve = event.params._ve.toHexString();
          }
          token.tFIAT = event.params._tFIAT.toHexString();
          token.usetFIAT = event.params._tFIAT.notEqual(Address.fromString(ZERO_ADDRESS));
          token.save();
        }
      } else {
        let token = NFT.load(concatId);
        if (token === null) {
          token = new NFT(concatId);
          token.tokenId = event.params._tokenId.toString();
          token.collection = event.params._collectionId.toString();
          token.latestTradedPriceInBNB = ZERO_BD;
          token.tradeVolumeBNB = ZERO_BD;
          token.totalTrades = ZERO_BI;
          token.isTradable = true;
          token.active = true;
          token.likes = ZERO_BI;
          token.disLikes = ZERO_BI;
          token.behindPaywall = ZERO_BI;
          token.bountyId = ZERO_BI;
          token.badgeId = ZERO_BI;
          token.dropinTimer = ZERO_BI;
          token.bidDuration = ZERO_BI;
          token.minBidIncrementPercentage = ZERO_BI;
          token.rsrcTokenId = ZERO_BI;
          token.superLikes = ZERO_BI;
          token.superDisLikes = ZERO_BI;
          token.start = ZERO_BI;
          token.period = ZERO_BI;
        } 
        token.currentSeller = collection.owner;
        token.updatedAt = event.block.timestamp;
        token.maxSupply = event.params._maxSupply
        token.transferrable = event.params._transferrable;
        token.currentAskPrice = toBigDecimal(event.params._askPrice, 18);
        if (event.params._ve.notEqual(Address.fromString(ZERO_ADDRESS))) {
          token.ve = event.params._ve.toHexString();
        }
        token.tFIAT = event.params._tFIAT.toHexString();
        token.usetFIAT = event.params._tFIAT.notEqual(Address.fromString(ZERO_ADDRESS));
        token.save();
      }
      let order = new AskOrder(event.transaction.hash.toHex());
      order.block = event.block.number;
      order.timestamp = event.block.timestamp;
      order.collection = event.params._collectionId.toString();
      if (isPaywall) {
        order.paywall = concatId;
        order.orderType = "NewPaywall";
      } else {
        order.nft = concatId;
        order.orderType = "NewNFT";
      }
      order.askPrice = toBigDecimal(event.params._askPrice, 18);
      order.seller = user.id;
      order.save();
    }
  }
}

export function handleVoted(event: Voted): void {
  let token = Item.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
  if (token !== null) {
    let vote = Vote.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString() + "-" + event.params.profileId.toString() + "-item");
    if (vote === null) {
      vote = new Vote(event.params.collectionId.toString() + "-" + event.params.tokenId.toString() + "-" + event.params.profileId.toString() + "-item");
      vote.profileId = event.params.profileId;
      vote.createdAt = event.block.timestamp;
      vote.item = token.id;
    }
    vote.updatedAt = event.block.timestamp;
    vote.liked = event.params.like;
    vote.save();
    token.likes = event.params.likes;
    token.disLikes = event.params.disLikes;
    token.save();
  }
}

export function handlePaywallVoted(event: PaywallVoted): void {
  let isPaywall = event.params.sender.equals(Address.fromString(PAYWALL_HELPER2))
  let isNFT = event.params.sender.equals(Address.fromString(NFT_HELPER2))
  if (isPaywall) {
    let token = new Paywall(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
    if (token !== null) {
      let vote = Vote.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString() + "-" + event.params.profileId.toString() + "-paywall");
      if (vote === null) {
        vote = new Vote(event.params.collectionId.toString() + "-" + event.params.tokenId.toString() + "-" + event.params.profileId.toString() + "-paywall");
        vote.profileId = event.params.profileId;
        vote.createdAt = event.block.timestamp;
        vote.paywall = token.id;
      }
      vote.updatedAt = event.block.timestamp;
      vote.liked = event.params.like;
      vote.save();
      token.likes = event.params.likes;
      token.disLikes = event.params.disLikes;
      token.save();
    }
  } else if (isNFT) {
    let token = new NFT(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
    if (token !== null) {
      let vote = Vote.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString() + "-" + event.params.profileId.toString() + "-nft");
      if (vote === null) {
        vote = new Vote(event.params.collectionId.toString() + "-" + event.params.tokenId.toString() + "-" + event.params.profileId.toString() + "-nft");
        vote.profileId = event.params.profileId;
        vote.createdAt = event.block.timestamp;
        vote.nft = token.id;
      }
      vote.updatedAt = event.block.timestamp;
      vote.liked = event.params.like;
      vote.save();
      token.likes = event.params.likes;
      token.disLikes = event.params.disLikes;
      token.save();
    }
  }
}

export function handleUpdateTaskEvent(event: UpdateTaskEvent): void {
  if (event.params.eventType.equals(ONE_BI)) {
    let token = Paywall.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
    if (token !== null) {
      let task = Task.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
      if (task === null) {
        task = new Task(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
        task.paywall = token.id;
        task.createdAt = event.block.timestamp;
      }
      task.linkToTask = event.params.linkToTask;
      task.updatedAt = event.block.timestamp;
      task.isSurvey = event.params.isSurvey;
      task.required = event.params.required;
      task.active = event.params.active;
      task.codes = event.params.codes;
      task.save();
    }
  } else if (event.params.eventType.equals(TWO_BI)) {
    let token = NFT.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
    if (token !== null) {
      let task = Task.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
      if (task === null) {
        task = new Task(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
        task.nft = token.id;
        task.createdAt = event.block.timestamp;
      }
      task.linkToTask = event.params.linkToTask;
      task.updatedAt = event.block.timestamp;
      task.isSurvey = event.params.isSurvey;
      task.required = event.params.required;
      task.active = event.params.active;
      task.codes = event.params.codes;
      task.save();
    } 
  } else {
    let token = Item.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
    if (token !== null) {
      let task = Task.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
      if (task === null) {
        task = new Task(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
        task.item = token.id;
        task.createdAt = event.block.timestamp;
      }
      task.linkToTask = event.params.linkToTask;
      task.updatedAt = event.block.timestamp;
      task.isSurvey = event.params.isSurvey;
      task.required = event.params.required;
      task.active = event.params.active;
      task.codes = event.params.codes;
      task.save();
    }
  }
}

export function handleReview(event: CreateReview): void {  
  log.warning("handleReview===============> - #{}", [event.params.isPaywall.toString()]);
  if (event.params.isPaywall.equals(ONE_BI)) {
    let token = Paywall.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
    let isNormal = event.params.votingPower !== null && event.params.votingPower.gt(ZERO_BI);
    if (token !== null) {
      let review = Review.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString() + "-" + event.params.userTokenId.toString() + '-' + event.params.isPaywall.toString());
      if (review === null) {
        review = new Review(event.params.collectionId.toString() + "-" + event.params.tokenId.toString() + "-" + event.params.userTokenId.toString() + '-' + event.params.isPaywall.toString());
        review.paywall = token.id;
        review.body = event.params.review;
        review.power = event.params.votingPower;
        review.normalReview = isNormal;
        review.good = event.params.good;
        if (event.params.good && !isNormal) {
          log.warning("handleReview===============> - #{}", ["1"]);
          token.superLikes = token.superLikes.plus(event.params.votingPower);
        } else if (!isNormal) {
          log.warning("handleReview===============> - #{}", ["2"]);
          token.superDisLikes = token.superDisLikes.plus(event.params.votingPower);
        }
        review.reviewer = event.params.reviewer.toHexString();
        review.reviewTime = event.params.reviewTime;
        review.save();
      } else {
        log.warning("handleReview===============> - #{}", ["3"]);
        if (event.params.good && review.good) {
          log.warning("handleReview===============> - #{}", ["4"]);
          if (!review.normalReview && !isNormal) {
            log.warning("handleReview===============> - #{}", ["5"]);
            token.superLikes = token.superLikes.minus(review.power)
            token.superLikes = token.superLikes.plus(event.params.votingPower)
          }
        } else if (event.params.good && !review.good) {
          log.warning("handleReview===============> - #{}", ["6"]);
          if (!review.normalReview && !isNormal) {
            log.warning("handleReview===============> - #{}", ["7"]);
            token.superDisLikes = token.superDisLikes.minus(review.power)
            token.superLikes = token.superLikes.plus(event.params.votingPower)
          }
        } else if (!event.params.good && review.good) {
          log.warning("handleReview===============> - #{}", ["8"]);
          if (!review.normalReview && !isNormal) {
            log.warning("handleReview===============> - #{}", ["9"]);
            token.superLikes = token.superLikes.minus(review.power)
            token.superDisLikes = token.superDisLikes.plus(event.params.votingPower)
          }
        } else {
          log.warning("handleReview===============> - #{}", ["10"]);
          if (!review.normalReview && !isNormal) {
            log.warning("handleReview===============> - #{}", ["11"]);
            token.superDisLikes = token.superDisLikes.minus(review.power)
            token.superDisLikes = token.superDisLikes.plus(event.params.votingPower)
          }
        }
        review.power = event.params.votingPower;
        review.good = event.params.good;
        review.normalReview = isNormal;
        review.body = event.params.review;
        review.reviewer = event.params.reviewer.toHexString();
        review.reviewTime = event.params.reviewTime;
        review.save();
      }
      token.save();
    }
  } else if (event.params.isPaywall.equals(TWO_BI)) {
    let token = NFT.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
    let isNormal = event.params.votingPower !== null && event.params.votingPower.gt(ZERO_BI);
    if (token !== null) {
      let review = Review.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString() + "-" + event.params.userTokenId.toString() + '-' + event.params.isPaywall.toString());
      if (review === null) {
        review = new Review(event.params.collectionId.toString() + "-" + event.params.tokenId.toString() + "-" + event.params.userTokenId.toString() + '-' + event.params.isPaywall.toString());
        review.nft = token.id;
        review.body = event.params.review;
        review.power = event.params.votingPower;
        review.normalReview = isNormal;
        review.good = event.params.good;
        if (event.params.good && !isNormal) {
          token.superLikes = token.superLikes.plus(event.params.votingPower)
        } else {
          token.superDisLikes = token.superDisLikes.plus(event.params.votingPower)
        }
        review.reviewer = event.params.reviewer.toHexString();
        review.reviewTime = event.params.reviewTime;
        review.save();
      } else {
        if (event.params.good && review.good) {
          if (!review.normalReview && !isNormal) {
            token.superLikes = token.superLikes.minus(review.power)
            token.superLikes = token.superLikes.plus(event.params.votingPower)
          }
        } else if (event.params.good && !review.good) {
          if (!review.normalReview && !isNormal) {
            token.superDisLikes = token.superDisLikes.minus(review.power)
            token.superLikes = token.superLikes.plus(event.params.votingPower)
          }
        } else if (!event.params.good && review.good) {
          if (!review.normalReview && !isNormal) {
            token.superLikes = token.superLikes.minus(review.power)
            token.superDisLikes = token.superDisLikes.plus(event.params.votingPower)
          }
        } else {
          if (!review.normalReview && !isNormal) {
            token.superDisLikes = token.superDisLikes.minus(review.power)
            token.superDisLikes = token.superDisLikes.plus(event.params.votingPower)
          }
        }
        review.power = event.params.votingPower;
        review.good = event.params.good;
        review.normalReview = isNormal;
        review.body = event.params.review;
        review.reviewer = event.params.reviewer.toHexString();
        review.reviewTime = event.params.reviewTime;
        review.save();
      }
      token.save();
    }
  } else if (event.params.isPaywall.equals(ZERO_BI)) {
    let token = Item.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString());
    log.warning("handleReview2===============> - #{} {}", [event.params.collectionId.toString(), event.params.tokenId.toString()]);
    let isNormal = !(event.params.votingPower !== null && event.params.votingPower.gt(ZERO_BI));
    if (token !== null) {
      let review = Review.load(event.params.collectionId.toString() + "-" + event.params.tokenId.toString() + "-" + event.params.userTokenId.toString() + '-' + event.params.isPaywall.toString());
      log.warning("handleReview2===============> - #{} {}", [event.params.collectionId.toString(), event.params.tokenId.toString()]);
      if (review === null) {
        review = new Review(event.params.collectionId.toString() + "-" + event.params.tokenId.toString() + "-" + event.params.userTokenId.toString() + '-' + event.params.isPaywall.toString());
        review.item = token.id;
        review.body = event.params.review;
        review.power = event.params.votingPower;
        review.normalReview = isNormal;
        review.good = event.params.good;
        if (event.params.good && !isNormal) {
          token.superLikes = token.superLikes.plus(event.params.votingPower)
        } else {
          token.superDisLikes = token.superDisLikes.plus(event.params.votingPower)
        }
        review.reviewer = event.params.reviewer.toHexString();
        review.reviewTime = event.params.reviewTime;
        review.save();
      } else {
        if (event.params.good && review.good) {
          if (!review.normalReview && !isNormal) {
            token.superLikes = token.superLikes.minus(review.power)
            token.superLikes = token.superLikes.plus(event.params.votingPower)
          }
        } else if (event.params.good && !review.good) {
          if (!review.normalReview && !isNormal) {
            token.superDisLikes = token.superDisLikes.minus(review.power)
            token.superLikes = token.superLikes.plus(event.params.votingPower)
          }
        } else if (!event.params.good && review.good) {
          if (!review.normalReview && !isNormal) {
            token.superLikes = token.superLikes.minus(review.power)
            token.superDisLikes = token.superDisLikes.plus(event.params.votingPower)
          }
        } else {
          if (!review.normalReview && !isNormal) {
            token.superDisLikes = token.superDisLikes.minus(review.power)
            token.superDisLikes = token.superDisLikes.plus(event.params.votingPower)
          }
        }
        review.power = event.params.votingPower;
        review.good = event.params.good;
        review.normalReview = isNormal;
        review.body = event.params.review;
        review.reviewer = event.params.reviewer.toHexString();
        review.reviewTime = event.params.reviewTime;
        review.save();
      }
      token.save();
    }
  }
}

export function handleAskInfo(event: AskInfo): void {
  let concatId = event.params.collectionId.toString() + "-" + event.params._tokenId.toString()
  if (event.params.isPaywall.equals(ONE_BI)) {
    log.warning("handleAskInfo equals===============> - #{}", ['1']);
    let token = Paywall.load(concatId);
    if (token !== null) {
      log.warning("handleAskInfo===============> - #{}", ['2']);
      token.prices = event.params.prices;
      token.start = event.params.start;
      token.isTradable = event.params.isTradeable;
      token.period = event.params.period;
      token.description = event.params.description;
      token.images = event.params.images;
      token.countries = event.params.countries;
      token.cities = event.params.cities;
      token.products = event.params.products;
      token.save();
      log.warning("handleAskInfo===============> - #{}", ['3']);
    }
  } else if (event.params.isPaywall.equals(TWO_BI)) {
    log.warning("handleAskInfo===============> - #{}", ['3']);
    log.warning("handleAskInfo ev===============> - #{}", [event.params.images.toString()]);
    let token = NFT.load(concatId);
    if (token !== null) {
      token.prices = event.params.prices;
      token.start = event.params.start;
      token.period = event.params.period;
      token.isTradable = event.params.isTradeable;
      token.description = event.params.description;
      token.images = event.params.images;
      token.countries = event.params.countries;
      token.cities = event.params.cities;
      token.products = event.params.products;
      token.save();
      log.warning("handleAskInfo===============> - #{}", ['4']);
    }
  } else {
    log.warning("handleAskInfo===============> - #{}", ['5']);
    let token = Item.load(concatId);
    if (token !== null) {
      token.prices = event.params.prices;
      token.start = event.params.start;
      token.period = event.params.period;
      token.isTradable = event.params.isTradeable;
      token.description = event.params.description;
      token.images = event.params.images;
      token.countries = event.params.countries;
      token.cities = event.params.cities;
      token.products = event.params.products;
      token.save();
     log.warning("handleAskInfo===============> - #{}", ['6']);
    }
  }
  let collection = Collection.load(event.params.collectionId.toString());
  if (collection !== null) {
    collection.products += ' ' + event.params.products;
    collection.save()
  }
}

export function handleUpdateCollection(event: UpdateCollection): void {
  let collection = Collection.load(event.params.collectionId.toString());
  if (collection !== null) {
    collection.name = event.params.name;
    collection.large = event.params.large;
    collection.small = event.params.small;
    collection.avatar = event.params.avatar;
    collection.description = event.params.desc;
    collection.contactChannels = event.params.contactChannels;
    collection.contacts = event.params.contacts;
    collection.workspaces = event.params.workspaces;
    collection.countries = event.params.countries;
    collection.cities = event.params.cities;
    collection.products = event.params.products;
    collection.save();
  }
}

export function handleUpdateOptions(event: UpdateOptions): void {
  let isItem = event.params._sender.equals(Address.fromString(ITEM_HELPER))
  let isNFT = event.params._sender.equals(Address.fromString(NFT_HELPER))
  log.warning("handleUpdateOptions1==============> - #{}", [event.params._min.toString()]);
  log.warning("handleUpdateOptions01==============> - #{}", [event.params._sender.toHex()]);
  log.warning("handleUpdateOptions2==============> - #{}", [isItem ? "true" : "false"]);
  log.warning("handleUpdateOptions3==============> - #{}", [isNFT ? "true" : "false"]);
  if (isItem) {
    let token = Item.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (token !== null) {
      let option = Option.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString() + "-" + event.params._element);
      if (option === null) {
        option = new Option(event.params._collectionId.toString() + "-" + event.params._tokenId.toString() + "-" + event.params._element);
      }
      option.min = event.params._min.toString();
      option.max = event.params._max.toString();
      option.unitPrice = event.params._unitPrice.toString();
      option.element = event.params._element;
      option.value = event.params._value.toString();
      option.currency = event.params._currency;
      option.category = event.params._category;
      option.traitType = event.params._traitType;
      option.item = token.id;
      option.save();
    }
  } else if (isNFT) {
    let token = NFT.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    let option = Option.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString() + "-" + event.params._element);
    if (token !== null) {
      if (option === null) {
        option = new Option(event.params._collectionId.toString() + "-" + event.params._tokenId.toString() + "-" + event.params._element);
      }
      option.min = event.params._min.toString();
      option.max = event.params._max.toString();
      option.unitPrice = event.params._unitPrice.toString();
      option.element = event.params._element;
      option.value = event.params._value.toString();
      option.currency = event.params._currency;
      option.category = event.params._category;
      option.traitType = event.params._traitType;
      option.nft = token.id;
      option.save();
    }
  }
}

export function handlePaywallUpdateOptions(event: PaywallUpdateOptions): void {
  let token = Paywall.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
  if (token !== null) {
    let option = Option.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString() + "-" + event.params._element);
    log.warning("===============> - #{}", [event.params._collectionId.toString() + "-" + event.params._tokenId.toString() + "-" + event.params._element]);
    if (option === null) {
      log.warning("===============> - #{}", ["OPTION NULL"]);
      option = new Option(event.params._collectionId.toString() + "-" + event.params._tokenId.toString() + "-" + event.params._element);
    }
    log.warning("===============> - #{}", ["OPTION CREATED"]);
    option.min = event.params._min.toString();
    option.max = event.params._max.toString();
    option.unitPrice = event.params._unitPrice.toString();
    option.element = event.params._element;
    option.value = event.params._value.toString();
    option.currency = event.params._currency;
    option.category = event.params._category;
    option.traitType = event.params._traitType;
    option.paywall = token.id;
    option.save();
  }
}

export function handleUserRegistration(event: UserRegistration): void {
  let registration = Registration.load(event.params.collectionId.toString() + "-" + event.params.userCollectionId.toString());
  if (registration === null) {
    registration = new Registration(event.params.collectionId.toString() + "-" + event.params.userCollectionId.toString());
    registration.block = event.block.number;
    registration.timestamp = event.block.timestamp;
    registration.collection = event.params.collectionId.toString();
    registration.userCollection = event.params.userCollectionId.toString();
    registration.active = event.params.active;
    registration.unregister = false;
    registration.save();
  } else {
    registration.active = event.params.active;
    if (!event.params.active) {
      registration.unregister = true;
    }
    registration.save()
  }

}

export function handleAskCancel(event: AskCancel): void {
  let collection = Collection.load(event.params.collection.toString());
  if (collection !== null) {
    let user = User.load(event.params.collection.toString());
    if (user !== null) {
      user.numberTokensListed = user.numberTokensListed.minus(ONE_BI);
      user.save();
      collection.numberTokensListed = collection.numberTokensListed.minus(ONE_BI);
      collection.save();
    }

    let token = Item.load(event.params.collection.toString() + "-" + event.params.tokenId.toString());
    if (token !== null) {
      token.currentSeller = ZERO_ADDRESS;
      token.updatedAt = event.block.timestamp;
      token.currentAskPrice = ZERO_BD;
      token.isTradable = false;
      token.save();
    }

    if (token !== null) {
      let order = new AskOrder(event.transaction.hash.toHex());
      order.block = event.block.number;
      order.timestamp = event.block.timestamp;
      order.collection = collection.id;
      order.item = token.id;
      order.orderType = "CancelItem";
      order.askPrice = toBigDecimal(ZERO_BI, 18);
      order.seller = event.params.collection.toString();
      order.save();
    }
  }
}

export function handlePaywallAskCancel(event: PaywallAskCancel): void {
  let isPaywall = event.params.sender.equals(Address.fromString(PAYWALL_HELPER))
  let isNFT = event.params.sender.equals(Address.fromString(NFT_ORDERS))
  let collection = Collection.load(event.params.collection.toString());
  if (collection !== null) {
    let user = User.load(event.params.collection.toString());
    if (user !== null) {
      if (isPaywall) {
        user.numberPaywallsListed = user.numberPaywallsListed.minus(ONE_BI);
        collection.numberPaywallsListed = collection.numberPaywallsListed.minus(ONE_BI);
      } else {
        user.numberNftsListed = user.numberNftsListed.minus(ONE_BI);
        collection.numberNftsListed = collection.numberNftsListed.minus(ONE_BI);
      }
      user.save();
      collection.save();
    }
    if (isPaywall) {
      let token = Paywall.load(event.params.collection.toString() + "-" + event.params.tokenId.toString());
      if (token !== null) {
        token.currentSeller = ZERO_ADDRESS;
        token.updatedAt = event.block.timestamp;
        token.currentAskPrice = ZERO_BD;
        token.isTradable = false;
        token.save();

        let order = new AskOrder(event.transaction.hash.toHex());
        order.block = event.block.number;
        order.timestamp = event.block.timestamp;
        order.collection = collection.id;
        order.paywall = token.id;
        order.orderType = "CancelPaywall";
        order.askPrice = toBigDecimal(ZERO_BI, 18);
        order.seller = event.params.collection.toString();
        order.save();
      }
    } else if (isNFT) {
      let token = NFT.load(event.params.collection.toString() + "-" + event.params.tokenId.toString());
      if (token !== null) {
        token.currentSeller = ZERO_ADDRESS;
        token.updatedAt = event.block.timestamp;
        token.currentAskPrice = ZERO_BD;
        token.isTradable = false;
        token.save();

        let order = new AskOrder(event.transaction.hash.toHex());
        order.block = event.block.number;
        order.timestamp = event.block.timestamp;
        order.collection = collection.id;
        order.nft = token.id;
        order.orderType = "CancelNFT";
        order.askPrice = toBigDecimal(ZERO_BI, 18);
        order.seller = event.params.collection.toString();
        order.save();
      }
    }
  } 
}

export function handleAskUpdate(event: AskUpdate): void {
  let token = Item.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
  if (token !== null) {
    token.updatedAt = event.block.timestamp;
    token.currentAskPrice = toBigDecimal(event.params._newPrice, 18);
    token.bidDuration = event.params._bidDuration;
    token.minBidIncrementPercentage = event.params._minBidIncrementPercentage;
    token.transferrable = event.params._transferrable;
    token.rsrcTokenId = event.params._rsrcTokenId;
    token.maxSupply = event.params._maxSupply;
    token.dropinTimer = event.params._dropinTimer;
    token.currentSeller = event.params._seller.toHexString();
    token.save();

    let order = new AskOrder(event.transaction.hash.toHex());
    order.block = event.block.number;
    order.timestamp = event.block.timestamp;
    order.collection = token.collection;
    order.nft = token.id;
    order.orderType = "ModifyItem";
    order.askPrice = toBigDecimal(event.params._newPrice, 18);
    order.seller = event.params._seller.toString();
    order.save();
  }
}

export function handlePaywallAskUpdate(event: PaywallAskUpdate): void {
  let isPaywall = event.params._sender.equals(Address.fromString(PAYWALL_HELPER))
  let isNFT = event.params._sender.equals(Address.fromString(NFT_ORDERS))
  if (isPaywall) {
    let token = Paywall.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (token !== null) {
      token.updatedAt = event.block.timestamp;
      token.currentAskPrice = toBigDecimal(event.params._newPrice, 18);
      token.bidDuration = event.params._bidDuration;
      token.minBidIncrementPercentage = event.params._minBidIncrementPercentage;
      token.transferrable = event.params._transferrable;
      token.rsrcTokenId = event.params._rsrcTokenId;
      token.maxSupply = event.params._maxSupply;
      token.dropinTimer = event.params._dropinTimer;
      token.currentSeller = event.params._seller.toHexString();
      token.save();

      let order = new AskOrder(event.transaction.hash.toHex());
      order.block = event.block.number;
      order.timestamp = event.block.timestamp;
      order.collection = token.collection;
      order.paywall = token.id;
      order.orderType = "ModifyPaywall";
      order.askPrice = toBigDecimal(event.params._newPrice, 18);
      order.seller = event.params._seller.toString();
      order.save();
    }
  } else if (isNFT) {
    let token = NFT.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (token !== null) {
      token.updatedAt = event.block.timestamp;
      token.currentAskPrice = toBigDecimal(event.params._newPrice, 18);
      token.bidDuration = event.params._bidDuration;
      token.minBidIncrementPercentage = event.params._minBidIncrementPercentage;
      token.transferrable = event.params._transferrable;
      token.rsrcTokenId = event.params._rsrcTokenId;
      token.maxSupply = event.params._maxSupply;
      token.dropinTimer = event.params._dropinTimer;
      token.currentSeller = event.params._seller.toHexString();
      token.save();

      let order = new AskOrder(event.transaction.hash.toHex());
      order.block = event.block.number;
      order.timestamp = event.block.timestamp;
      order.collection = token.collection;
      order.nft = token.id;
      order.orderType = "ModifyNFT";
      order.askPrice = toBigDecimal(event.params._newPrice, 18);
      order.seller = event.params._seller.toString();
      order.save();
    }
  }
}

export function handleAskUpdateCashback(event: AskUpdateCashback): void {
  let token = Item.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
  if (token !== null) {
    let pr = PriceReductor.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (pr === null) {
      pr = new PriceReductor(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    }
    pr.cashbackStatus = BigInt.fromI32(event.params._cashbackStatus);
    pr.cashbackStart = event.params._cashbackStart;
    pr.cashNotCredit = event.params._cashNotCredit;
    pr.cashbackNumbers = event.params._cashbackNumbers;
    pr.cashbackCost = event.params._cashbackCost;
    pr.save();

    token.updatedAt = event.block.timestamp;
    token.priceReductor = pr.id;
    token.save();
  }
}

export function handlePaywallAskUpdateDiscount(event: PaywallAskUpdateDiscount): void {
  let isPaywall = event.params._sender.equals(Address.fromString(PAYWALL_HELPER))
  let isNFT = event.params._sender.equals(Address.fromString(NFT_ORDERS))
  if (isPaywall) {
    let token = Paywall.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (token !== null) {
      let pr = PriceReductor.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      if (pr === null) {
        pr = new PriceReductor(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      }
      pr.discountStatus = BigInt.fromI32(event.params._discountStatus);
      pr.discountStart = event.params._discountStart;
      pr.cashNotCredit = event.params._cashNotCredit;
      pr.checkIdentityCode = event.params._checkIdentityCode;
      pr.checkItemOnly = event.params._checkItemOnly;
      pr.discountNumbers = event.params._discountNumbers;
      pr.discountCost = event.params._discountCost;
      pr.save();

      token.priceReductor = pr.id
      token.updatedAt = event.block.timestamp;
      token.save();
    }
  } else if (isNFT) {
    let token = NFT.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (token !== null) {
      let pr = PriceReductor.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      if (pr === null) {
        pr = new PriceReductor(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      }
      pr.discountStatus = BigInt.fromI32(event.params._discountStatus);
      pr.discountStart = event.params._discountStart;
      pr.cashNotCredit = event.params._cashNotCredit;
      pr.checkIdentityCode = event.params._checkIdentityCode;
      pr.checkItemOnly = event.params._checkItemOnly;
      pr.discountNumbers = event.params._discountNumbers;
      pr.discountCost = event.params._discountCost;
      pr.save();

      token.priceReductor = pr.id
      token.updatedAt = event.block.timestamp;
      token.save();
    }
  }
}

export function handleAskUpdateDiscount(event: AskUpdateDiscount): void {
  let token = Item.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
  if (token !== null) {
    let pr = PriceReductor.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (pr === null) {
      pr = new PriceReductor(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    }
    pr.discountStatus = BigInt.fromI32(event.params._discountStatus);
    pr.discountStart = event.params._discountStart;
    pr.cashNotCredit = event.params._cashNotCredit;
    pr.checkIdentityCode = event.params._checkIdentityCode;
    pr.checkItemOnly = event.params._checkItemOnly;
    pr.discountNumbers = event.params._discountNumbers;
    pr.discountCost = event.params._discountCost;
    pr.save();

    token.priceReductor = pr.id
    token.updatedAt = event.block.timestamp;
    token.save();
  }
}

export function handlePaywallAskUpdateCashback(event: PaywallAskUpdateCashback): void {
  let isPaywall = event.params._sender.equals(Address.fromString(PAYWALL_HELPER))
  let isNFT = event.params._sender.equals(Address.fromString(NFT_ORDERS))
  if (isPaywall) {
    let token = Paywall.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (token !== null) {
      let pr = PriceReductor.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      if (pr === null) {
        pr = new PriceReductor(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      }
      pr.cashbackStatus = BigInt.fromI32(event.params._cashbackStatus);
      pr.cashbackStart = event.params._cashbackStart;
      pr.cashNotCredit = event.params._cashNotCredit;
      pr.cashbackNumbers = event.params._cashbackNumbers;
      pr.cashbackCost = event.params._cashbackCost;
      pr.save();
  
      token.updatedAt = event.block.timestamp;
      token.priceReductor = pr.id;
      token.save();
    }
  } else if (isNFT) {
    let token = NFT.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (token !== null) {
      let pr = PriceReductor.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      if (pr === null) {
        pr = new PriceReductor(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      }
      pr.cashbackStatus = BigInt.fromI32(event.params._cashbackStatus);
      pr.cashbackStart = event.params._cashbackStart;
      pr.cashNotCredit = event.params._cashNotCredit;
      pr.cashbackNumbers = event.params._cashbackNumbers;
      pr.cashbackCost = event.params._cashbackCost;
      pr.save();
  
      token.updatedAt = event.block.timestamp;
      token.priceReductor = pr.id;
      token.save();
    }
  }
}

export function handleAskUpdateIdentity(event: AskUpdateIdentity): void {
  let token = Item.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
  if (token !== null) {
    let ip = IdentityProof.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (ip === null) {
      ip = new IdentityProof(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    }
    ip.requiredIndentity = event.params._requiredIndentity;
    ip.valueName = event.params._valueName;
    ip.onlyTrustWorthyAuditors = event.params._onlyTrustWorthyAuditors;
    ip.dataKeeperOnly = event.params._dataKeeperOnly;
    ip.maxUse = event.params._maxUse;
    ip.minIDBadgeColor = BigInt.fromI32(event.params._minIDBadgeColor);
    ip.save();
    token.identityProof = ip.id;
    token.updatedAt = event.block.timestamp;
    token.save();
  }
}

export function handlePaywallAskUpdateIdentity(event: PaywallAskUpdateIdentity): void {
  let isPaywall = event.params._sender.equals(Address.fromString(PAYWALL_HELPER))
  let isNFT = event.params._sender.equals(Address.fromString(NFT_ORDERS))
  if (isPaywall) {
    let token = Paywall.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (token !== null) {
      let ip = IdentityProof.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      if (ip === null) {
        ip = new IdentityProof(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      }
      ip.requiredIndentity = event.params._requiredIndentity;
      ip.valueName = event.params._valueName;
      ip.onlyTrustWorthyAuditors = event.params._onlyTrustWorthyAuditors;
      ip.dataKeeperOnly = event.params._dataKeeperOnly;
      ip.maxUse = event.params._maxUse;
      ip.minIDBadgeColor = BigInt.fromI32(event.params._minIDBadgeColor);
      ip.save();

      token.identityProof = ip.id;
      token.updatedAt = event.block.timestamp;
      token.save();
    }
  } else if (isNFT) {
    let token = NFT.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
    if (token !== null) {
      let ip = IdentityProof.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      if (ip === null) {
        ip = new IdentityProof(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      }
      ip.requiredIndentity = event.params._requiredIndentity;
      ip.valueName = event.params._valueName;
      ip.onlyTrustWorthyAuditors = event.params._onlyTrustWorthyAuditors;
      ip.dataKeeperOnly = event.params._dataKeeperOnly;
      ip.maxUse = event.params._maxUse;
      ip.minIDBadgeColor = BigInt.fromI32(event.params._minIDBadgeColor);
      ip.save();

      token.identityProof = ip.id;
      token.updatedAt = event.block.timestamp;
      token.save();
    }
  }
}

export function handleUpdateValuepools(event: UpdateValuepools): void {
  let collection = Collection.load(event.params.collectionId.toString());
  if (collection !== null) {
    let valuepool = Valuepool.load(event.params.collectionId.toString() + '-' + event.params.valuepool.toHexString());
    if (valuepool === null) {
      valuepool = new Valuepool(event.params.collectionId.toString() + '-' + event.params.valuepool.toHexString());
      valuepool.active = true;
      valuepool.valuepool = event.params.valuepool.toHexString();
      valuepool.collection = event.params.collectionId.toString();
      valuepool.save();
    } else if (!event.params.add) {
      valuepool.active = false;
      valuepool.collection = '';
      valuepool.save();
    }
  }
}

export function handleAddReferral(event: AddReferral): void {
  let collection = Collection.load(event.params._collectionId.toString());
  let isNFT = event.params._sender.equals(Address.fromString(NFT_ORDERS))
  let isItem = event.params._sender.equals(Address.fromString(ITEM_ORDERS))
  let isPaywall = event.params._sender.equals(Address.fromString(PAYWALL_ORDERS))
  log.warning("AddReferral===============> - #{}", [event.params._collectionId.toString()]);
  log.warning("AddReferral isNFT===============> - #{}", [isNFT.toString()]);
  log.warning("AddReferral isItem===============> - #{}", [isItem.toString()]);
  log.warning("AddReferral isPaywall===============> - #{}", [isPaywall.toString()]);
  if (collection !== null) {
    let registration = PartnerRegistration.load(event.params._collectionId.toString() + "-" + event.params._referrerCollectionId.toString());
    if (registration === null) {
      registration = new PartnerRegistration(event.params._collectionId.toString() + "-" + event.params._referrerCollectionId.toString());
    }
    registration.active = true;
    registration.block = event.block.number;
    registration.timestamp = event.block.timestamp;
    registration.bountyId = event.params._bountyId;
    registration.collection = event.params._collectionId.toString();
    registration.partnerCollection = event.params._referrerCollectionId.toString();

    let category = isItem ? '1' : isNFT ? '2' : isPaywall ? '3' : '0';
    if (isNFT) {
      let item = NFT.load(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString());
      if (item !== null) {
        let mirror = Mirror.load(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString() + '-' + category);
        if (mirror === null) {
          mirror = new Mirror(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString() + '-' + category);
          mirror.nft = item.id;
          mirror.active = true;
          mirror.registration = registration.id;
          mirror.save();
          collection.numberPartnerNftsListed = collection.numberPartnerNftsListed.plus(ONE_BI);
          collection.save();
        }
      } 
    } else if (isItem) {
      let item = Item.load(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString());
      if (item !== null  && event.params._tokenId !== "") {
        let mirror = Mirror.load(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString() + '-' + category);
        if (mirror === null) {
          mirror = new Mirror(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString() + '-' + category);
          mirror.item = item.id;
          mirror.active = true;
          mirror.registration = registration.id;
          mirror.save();
          collection.numberPartnerTokensListed = collection.numberPartnerTokensListed.plus(ONE_BI);
          collection.save();
        }
      }
    } else if (isPaywall) {
      let paywall = Paywall.load(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString());
      if (paywall !== null) {
        let mirror = Mirror.load(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString() + '-' + category);
        if (mirror === null) {
          mirror = new Mirror(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString() + '-' + category);
          mirror.paywall = paywall.id;
          mirror.active = true;
          mirror.registration = registration.id;
          mirror.save();
          collection.numberPartnerPaywallsListed = collection.numberPartnerPaywallsListed.plus(ONE_BI);
          collection.save();
        }
      }
    }
    registration.save();
  }
}

export function handleCloseReferral(event: CloseReferral): void {
  let collection = Collection.load(event.params._collectionId.toString());
  if (collection !== null) {
    let registration = PartnerRegistration.load(event.params._collectionId.toString() + "-" + event.params._referrerCollectionId.toString());
    if (registration !== null) {
      registration.active = !event.params._deactivate;
      let isNFT = event.params._sender.equals(Address.fromString(NFT_HELPER2))
      let isItem = event.params._sender.equals(Address.fromString(ITEM_HELPER2))
      if (isNFT) {
        let item = NFT.load(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString());
        if (item !== null) {
          let mirror = Mirror.load(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString());
          if (mirror !== null) {
            mirror.item = '';
            mirror.nft = '';
            mirror.paywall = '';
            if (event.params._deactivate) {
              mirror.registration = '';
              mirror.active = false;
            }
            mirror.save();
          }
        } 
        collection.numberPartnerNftsListed = collection.numberPartnerNftsListed.minus(ONE_BI);
      } else if (isItem) {
        let item = Item.load(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString());
        if (item !== null) {
          let mirror = Mirror.load(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString());
          if (mirror !== null) {
            mirror.item = '';
            mirror.nft = '';
            mirror.paywall = '';
            if (event.params._deactivate) {
              mirror.registration = '';
              mirror.active = false;
            }
            mirror.save();
          }
        }
        collection.numberPartnerTokensListed = collection.numberPartnerTokensListed.minus(ONE_BI);
      } else {
        let paywall = Paywall.load(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString());
        if (paywall !== null) {
          let mirror = Mirror.load(event.params._referrerCollectionId.toString() + "-" + event.params._tokenId.toString());
          if (mirror !== null) {
            mirror.item = '';
            mirror.nft = '';
            mirror.paywall = '';
            if (event.params._deactivate) {
              mirror.registration = '';
              mirror.active = false;
            }
            mirror.save();
          }
        }
        collection.numberPartnerPaywallsListed = collection.numberPartnerPaywallsListed.minus(ONE_BI);
      }
      collection.save();
      registration.save();
    }
  }
}

export function handleUpdatePaywall(event: UpdatePaywall): void {
  let paywall = Paywall.load(event.params._paywallId.toString());
  if (paywall !== null) {
    if (event.params._isNFT) {
      log.warning("handleUpdatePaywall1===============> - #{}", [event.params._paywallId.toString()]);
      let item = NFT.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      if (item !== null) {
        log.warning("handleUpdatePaywall2===============> - #{}", [event.params._collectionId.toString() + "-" + event.params._tokenId.toString()]);
        let paywallMirror = PaywallMirror.load(event.params._collectionId.toString() + "-" + event.params._paywallId.toString() + "-" + event.params._tokenId.toString() + "-nft");
        if (paywallMirror === null) {
          log.warning("handleUpdatePaywall3===============> - #{}", [event.params._collectionId.toString() + "-" + event.params._paywallId.toString() + "-" + event.params._tokenId.toString() + "-nft"]);
          paywallMirror = new PaywallMirror(event.params._collectionId.toString() + "-" + event.params._paywallId.toString() + "-" + event.params._tokenId.toString() + "-nft");
          paywallMirror.createdAt = event.block.timestamp;
        }
        paywallMirror.updatedAt = event.block.timestamp;
        paywallMirror.nft = event.params._add ? item.id : '';
        paywallMirror.paywall = event.params._add ? paywall.id : '';
        paywallMirror.active = event.params._add;
        log.warning("handleUpdatePaywall4===============> - #{}", [item.behindPaywall.toString()]);
        log.warning("handleUpdatePaywall6===============> - #{}", ['5']);
        if (item.behindPaywall.equals(ZERO_BI) || item.behindPaywall.equals(ONE_BI)) {
          item.images = event.params._images;
        }
        if (event.params._add) {
          item.behindPaywall = item.behindPaywall.plus(ONE_BI) 
        }
        if (!item.behindPaywall.equals(ZERO_BI) && !event.params._add) {
          item.behindPaywall = item.behindPaywall.minus(ONE_BI)
        }
        item.images = event.params._images;
        item.save()
        paywallMirror.save();
      }
    } else {
      let item = Item.load(event.params._collectionId.toString() + "-" + event.params._tokenId.toString());
      if (item !== null) {
        let paywallMirror = PaywallMirror.load(event.params._collectionId.toString() + "-" + event.params._paywallId.toString() + "-" + event.params._tokenId.toString() + "-item");
        if (paywallMirror === null) {
          paywallMirror = new PaywallMirror(event.params._collectionId.toString() + "-" + event.params._paywallId.toString() + "-" + event.params._tokenId.toString() + "-item");
          paywallMirror.createdAt = event.block.timestamp;
        }
        paywallMirror.updatedAt = event.block.timestamp;
        paywallMirror.item = event.params._add ? item.id : '';
        paywallMirror.paywall = event.params._add ? paywall.id : '';
        paywallMirror.active = event.params._add;
        if (event.params._add) {
          item.behindPaywall = item.behindPaywall.plus(ONE_BI) 
        }
        if (!item.behindPaywall.equals(ZERO_BI) && !event.params._add) {
          item.behindPaywall = item.behindPaywall.minus(ONE_BI)
        }
        item.images = event.params._images;
        item.save();
        paywallMirror.save();
      }
    }
  }
}

export function handlePartnerRegistrationRequest(event: PartnerRegistrationRequest): void {
  let registration = PartnerRegistration.load(event.params.collectionId.toString() + "-" + event.params.partnerCollectionId.toString());
  if (registration === null) {
    registration = new PartnerRegistration(event.params.collectionId.toString() + "-" + event.params.partnerCollectionId.toString());
    registration.block = event.block.number;
    registration.timestamp = event.block.timestamp;
    registration.identityProofId = event.params.identityProofId;
    registration.collection = event.params.collectionId.toString();
    registration.partnerCollection = event.params.partnerCollectionId.toString();
    registration.active = false;
    registration.unregister = false;
    registration.save();
  }
}

export function handleUpdateAnnouncement(event: UpdateAnnouncement): void {
  let announcement = Announcement.load(event.params.collectionId.toString() + "-" + event.params.position.toString());
  if (announcement === null) {
    announcement = new Announcement(event.params.collectionId.toString() + "-" + event.params.position.toString());
    announcement.block = event.block.number;
    announcement.timestamp = event.block.timestamp;
    announcement.updatedAt = event.block.timestamp;
    announcement.collection = event.params.collectionId.toString();
    announcement.active = event.params.active;
    announcement.title = event.params.anouncementTitle;
    announcement.body = event.params.anouncementContent;
    announcement.save();
  } else {
    announcement.updatedAt = event.block.timestamp;
    announcement.active = event.params.active;
    announcement.title = event.params.anouncementTitle;
    announcement.body = event.params.anouncementContent;
    announcement.save();
  }
}

export function handleCreatePaywallARP(event: CreatePaywallARP): void {
  let paywallARP = PaywallARP.load(event.params.collectionId.toString());
  if (paywallARP === null) {
    paywallARP = new PaywallARP(event.params.collectionId.toString());
    paywallARP.createdAt = event.block.timestamp;
    paywallARP.updatedAt = event.block.timestamp;
    paywallARP.collection = event.params.collectionId.toString();
    paywallARP.paywallAddress = event.params.subscriptionARP.toHexString();
    paywallARP.active = true;
    paywallARP.save();
  }
}

export function handleDeletePaywallARP(event: DeletePaywallARP): void {
  let paywallARP = PaywallARP.load(event.params.collectionId.toString());
  if (paywallARP !== null) {
    paywallARP.updatedAt = event.block.timestamp;
    paywallARP.active = false;
    paywallARP.collection = '';
    paywallARP.save();
  }
}

export function handleUpdateSubscriptionInfo(event: UpdateSubscriptionInfo): void {
  let paywallARP = PaywallARP.load(event.params.collectionId.toString());
  if (paywallARP !== null) {
    paywallARP.updatedAt = event.block.timestamp;
    let trial = Trial.load(event.params.collectionId.toHexString() + '-' + event.params.optionId.toString());
    if (trial === null) {
      trial = new Trial(event.params.collectionId.toHexString() + '-' + event.params.optionId.toString());
      trial.paywallARP = paywallARP.id;
    }
    trial.optionId = event.params.optionId;
    trial.period = event.params.freeTrialPeriod;
    trial.save();
    paywallARP.save();
  }
}

export function handleUpdateProtocol(event: UpdateProtocol): void {
  let paywallARP = PaywallARP.load(event.params.collectionId.toString());
  let paywall = Paywall.load(event.params.collectionId.toString() + "-" + event.params.paywallId.toString());
  if (paywallARP !== null && paywall !== null) {
    let protocol = Protocol.load(event.params.collectionId.toString() + '-' + event.params.protocolId.toString());
    if (protocol === null) {
        protocol = new Protocol(event.params.collectionId.toString() + '-' + event.params.protocolId.toString());
        protocol.createdAt = event.block.timestamp;
        protocol.updatedAt = event.block.timestamp;
        protocol.autoCharge = false;
        protocol.active = true;
        protocol.optionId = event.params.optionId;
        protocol.nfticketId = event.params.nfticketId;
        protocol.referrerCollectionId = event.params.referrerCollectionId;
        protocol.paywall = paywall.id;
        protocol.paywallARP = event.params.collectionId.toString();
        protocol.save();
    }
  }
}

export function handleDeleteProtocol(event: DeleteProtocol): void {
  let protocol = Protocol.load(event.params.collectionId.toString() + '-' + event.params.protocolId.toString());
  if (protocol !== null) {
    protocol.active = false;
    protocol.updatedAt = event.block.timestamp;
    protocol.save();
  }
}

export function handleUpdateAutoCharge(event: UpdateAutoCharge): void {
  let protocol = Protocol.load(event.params.collectionId.toString() + '-' + event.params.protocolId.toString());
  if (protocol !== null) {
    protocol.autoCharge = event.params.autocharge;
    protocol.updatedAt = event.block.timestamp;
    protocol.save();
  }
}

/**
 * BUY ORDERS
 */

export function handleTrade(event: Trade): void {
  // 1. Buyer
  let buyer = User.load(event.params.buyer.toHex());

  // Buyer may not exist
  if (buyer === null) {
    buyer = new User(event.params.buyer.toHex());
    buyer.numberTokensListed = ZERO_BI;
    buyer.numberPaywallsListed = ZERO_BI;
    buyer.numberNftsListed = ZERO_BI;
    buyer.numberTokensPurchased = ONE_BI; // 1 token purchased
    buyer.numberNftsPurchased = ZERO_BI;
    buyer.numberPaywallsPurchased = ZERO_BI;
    buyer.numberTokensSold = ZERO_BI;
    buyer.numberNftsSold = ZERO_BI;
    buyer.numberPaywallsSold = ZERO_BI;
    buyer.totalVolumeInBNBTokensPurchased = toBigDecimal(event.params.askPrice, 18);
    buyer.totalVolumeInBNBNftsPurchased = ZERO_BD;
    buyer.totalVolumeInBNBPaywallsPurchased = ZERO_BD;
    buyer.totalVolumeInBNBNftsSold = ZERO_BD;
    buyer.totalVolumeInBNBTokensSold = ZERO_BD;
    buyer.totalVolumeInBNBPaywallsSold = ZERO_BD;
    buyer.totalFeesCollectedInBNB = ZERO_BD;
    buyer.averageTokenPriceInBNBPurchased = buyer.totalVolumeInBNBTokensPurchased;
    buyer.averagePaywallPriceInBNBPurchased = ZERO_BD;
    buyer.averageNftPriceInBNBPurchased = ZERO_BD;
    buyer.averageTokenPriceInBNBSold = ZERO_BD;
    buyer.averagePaywallPriceInBNBSold = ZERO_BD;
    buyer.averageNftPriceInBNBSold = ZERO_BD;
  } else {
    buyer.numberTokensPurchased = buyer.numberTokensPurchased.plus(ONE_BI);
    buyer.totalVolumeInBNBTokensPurchased = buyer.totalVolumeInBNBTokensPurchased.plus(
      toBigDecimal(event.params.askPrice, 18)
    );

    buyer.averageTokenPriceInBNBPurchased = buyer.totalVolumeInBNBTokensPurchased.div(
      buyer.numberTokensPurchased.toBigDecimal()
    );
  }

  // 2. Collection
  let collection = Collection.load(event.params.collectionId.toString());
  if (collection !== null) {
    collection.totalTrades = collection.totalTrades.plus(ONE_BI);
    collection.totalVolumeBNB = collection.totalVolumeBNB.plus(toBigDecimal(event.params.askPrice, 18));
    collection.save();
  }

  // 3. Seller
  let seller = User.load(event.params.seller.toHex());
  if (seller !== null) {
    seller.numberTokensSold = seller.numberTokensSold.plus(ONE_BI);
    seller.totalVolumeInBNBTokensSold = seller.totalVolumeInBNBTokensSold.plus(toBigDecimal(event.params.netPrice, 18));
    seller.averageTokenPriceInBNBSold = seller.totalVolumeInBNBTokensSold.div(seller.numberTokensSold.toBigDecimal());
    seller.save();
  }

  // 4. NFT
  let tokenConcatId = event.params.collectionId.toString() + "-" + event.params.tokenId.toString();
  let token = Item.load(tokenConcatId);
  if (token !== null) {
    token.latestTradedPriceInBNB = toBigDecimal(event.params.askPrice, 18);
    token.tradeVolumeBNB = token.tradeVolumeBNB.plus(token.latestTradedPriceInBNB);
    token.updatedAt = event.block.timestamp;
    token.totalTrades = token.totalTrades.plus(ONE_BI);
    token.maxSupply = token.maxSupply.minus(ONE_BI);
    token.save();
  }
  // 5. Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.nfTicketId = event.params.nfTicketId;
  transaction.collection = event.params.collectionId.toString();
  transaction.item = tokenConcatId;
  transaction.askPrice = toBigDecimal(event.params.askPrice, 18);
  transaction.netPrice = toBigDecimal(event.params.netPrice, 18);
  transaction.tokenType = 'Item';
  transaction.buyer = event.params.buyer.toHex();
  transaction.seller = event.params.seller.toHex();
  let uri = fetchTokenURI(Address.fromString(NFTICKET_HELPER2), event.params.nfTicketId);
  if (uri !== null) {
    transaction.metadataUrl = uri;
    log.warning("uri1===============> - #{}", [uri]);
  }
  transaction.save();
  buyer.save();

  updateCollectionDayData(event.params.collectionId, toBigDecimal(event.params.askPrice, 18), event);
  updateMarketPlaceDayData(toBigDecimal(event.params.askPrice, 18), event);
}

export function handlePaywallTrade(event: PaywallTrade): void {
  log.warning("handlePaywallTrade1===============> - #{}", [event.params.buyer.toHex()]);
  log.warning("handlePaywallTrade2===============> - #{}", [event.params.seller.toHex()]);

  // 1. Buyer
  let buyer = User.load(event.params.buyer.toHex());
  
  // Buyer may not exist
  if (buyer === null) {
    buyer = new User(event.params.buyer.toHex());
    buyer.numberTokensListed = ZERO_BI;
    buyer.numberPaywallsListed = ZERO_BI;
    buyer.numberNftsListed = ZERO_BI;
    buyer.numberTokensPurchased = ZERO_BI;
    buyer.numberNftsPurchased = event.params.eventType == ONE_BI ? ZERO_BI : ONE_BI;  // 1 token might be purchased
    buyer.numberPaywallsPurchased = event.params.eventType == TWO_BI ? ZERO_BI : ONE_BI;  // 1 token might be purchased
    buyer.numberTokensSold = ZERO_BI;
    buyer.numberNftsSold = ZERO_BI;
    buyer.numberPaywallsSold = ZERO_BI;
    buyer.totalVolumeInBNBTokensPurchased = ZERO_BD;
    buyer.totalVolumeInBNBNftsPurchased = event.params.eventType == TWO_BI ? toBigDecimal(event.params.askPrice, 18) : ZERO_BD;
    buyer.totalVolumeInBNBPaywallsPurchased = event.params.eventType == ONE_BI ? toBigDecimal(event.params.askPrice, 18) : ZERO_BD;
    buyer.totalVolumeInBNBNftsSold = ZERO_BD;
    buyer.totalVolumeInBNBTokensSold = ZERO_BD;
    buyer.totalVolumeInBNBPaywallsSold = ZERO_BD;
    buyer.totalFeesCollectedInBNB = ZERO_BD;
    buyer.averageTokenPriceInBNBPurchased = ZERO_BD;
    buyer.averagePaywallPriceInBNBPurchased = buyer.averagePaywallPriceInBNBPurchased;
    buyer.averageNftPriceInBNBPurchased = buyer.averageNftPriceInBNBPurchased;
    buyer.averageTokenPriceInBNBSold = ZERO_BD;
    buyer.averagePaywallPriceInBNBSold = ZERO_BD;
    buyer.averageNftPriceInBNBSold = ZERO_BD;
  } else if (event.params.eventType == ONE_BI) { // paywall
    buyer.numberPaywallsPurchased = buyer.numberPaywallsPurchased.plus(ONE_BI);
    
    buyer.totalVolumeInBNBPaywallsPurchased = buyer.totalVolumeInBNBPaywallsPurchased.plus(
      toBigDecimal(event.params.askPrice, 18)
    );

    buyer.averagePaywallPriceInBNBPurchased = buyer.totalVolumeInBNBPaywallsPurchased.div(
      buyer.numberPaywallsPurchased.toBigDecimal()
    );
  } else if (event.params.eventType == TWO_BI) { // nft
    buyer.numberNftsPurchased = buyer.numberNftsPurchased.plus(ONE_BI);
    buyer.totalVolumeInBNBNftsPurchased = buyer.totalVolumeInBNBNftsPurchased.plus(
      toBigDecimal(event.params.askPrice, 18)
    );

    buyer.averageNftPriceInBNBPurchased = buyer.totalVolumeInBNBNftsPurchased.div(
      buyer.numberNftsPurchased.toBigDecimal()
    );
  }

  // 2. Seller
  let seller = User.load(event.params.seller.toHex());
  if (seller !== null) {
    if (event.params.eventType == TWO_BI) { // nft
      seller.numberNftsSold = seller.numberNftsSold.plus(ONE_BI);
      seller.totalVolumeInBNBNftsSold = seller.totalVolumeInBNBNftsSold.plus(toBigDecimal(event.params.netPrice, 18));
      seller.averageNftPriceInBNBSold = seller.totalVolumeInBNBNftsSold.div(seller.numberNftsSold.toBigDecimal());
    } else { // paywall
      seller.numberPaywallsSold = seller.numberPaywallsSold.plus(ONE_BI);
      seller.totalVolumeInBNBPaywallsSold = seller.totalVolumeInBNBPaywallsSold.plus(toBigDecimal(event.params.netPrice, 18));
      seller.averagePaywallPriceInBNBSold = seller.totalVolumeInBNBPaywallsSold.div(seller.numberPaywallsSold.toBigDecimal());
    }
    seller.save();
  }
  // 3. Collection
  let collection = Collection.load(event.params.collectionId.toString());
  if (collection !== null) {
    collection.totalTrades = collection.totalTrades.plus(ONE_BI);
    collection.totalVolumeBNB = collection.totalVolumeBNB.plus(toBigDecimal(event.params.askPrice, 18));
    collection.save();
  }

  // 4. NFT
  let tokenConcatId = event.params.collectionId.toString() + "-" + event.params.tokenId.toString();
  if (event.params.eventType == ONE_BI) {
    let token = Paywall.load(tokenConcatId);
    if (token !== null) {
      token.latestTradedPriceInBNB = toBigDecimal(event.params.askPrice, 18);
      token.tradeVolumeBNB = token.tradeVolumeBNB.plus(token.latestTradedPriceInBNB);
      token.updatedAt = event.block.timestamp;
      token.totalTrades = token.totalTrades.plus(ONE_BI);
      token.maxSupply = token.maxSupply.minus(ONE_BI);
      token.save();
    }
  } else {
    let token = NFT.load(tokenConcatId);
    if (token !== null) {
      token.latestTradedPriceInBNB = toBigDecimal(event.params.askPrice, 18);
      token.tradeVolumeBNB = token.tradeVolumeBNB.plus(token.latestTradedPriceInBNB);
      token.updatedAt = event.block.timestamp;
      token.totalTrades = token.totalTrades.plus(ONE_BI);
      token.maxSupply = token.maxSupply.minus(ONE_BI);
      token.save();
    }
  }
  // 5. Transaction
  let transaction = new Transaction(event.transaction.hash.toHex());

  transaction.block = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transaction.nfTicketId = event.params.nfTicketId;
  transaction.collection = event.params.collectionId.toString();
  if (event.params.eventType == ONE_BI) {
    transaction.paywall = tokenConcatId;
    transaction.tokenType = 'Paywall';
  } else {
    transaction.nft = tokenConcatId;
    transaction.tokenType = 'Nft';
  }
  transaction.askPrice = toBigDecimal(event.params.askPrice, 18);
  transaction.netPrice = toBigDecimal(event.params.netPrice, 18);
  transaction.buyer = event.params.buyer.toHex();
  transaction.seller = event.params.seller.toHex();
  let uri = fetchTokenURI(Address.fromString(NFTICKET_HELPER2), event.params.nfTicketId);
  if (uri !== null) {
    transaction.metadataUrl = uri;
    log.warning("uri2===============> - #{}", [uri]);
  }
  transaction.save();
  buyer.save();

  updateCollectionDayData(event.params.collectionId, toBigDecimal(event.params.askPrice, 18), event);
  updateMarketPlaceDayData(toBigDecimal(event.params.askPrice, 18), event);
}

/**
 * ROYALTIES
 */

export function handleRevenueClaim(event: RevenueClaim): void {
  let user = User.load(event.params.claimer.toHex());
  if (user === null) {
    user = new User(event.params.claimer.toHex());
    user.numberTokensListed = ZERO_BI;
    user.numberPaywallsListed = ZERO_BI;
    user.numberNftsListed = ZERO_BI;
    user.numberTokensPurchased = ZERO_BI;
    user.numberNftsPurchased = ZERO_BI;
    user.numberPaywallsPurchased = ZERO_BI;
    user.numberTokensSold = ZERO_BI;
    user.numberNftsSold = ZERO_BI;
    user.numberPaywallsSold = ZERO_BI;
    user.totalVolumeInBNBTokensPurchased = ZERO_BD;
    user.totalVolumeInBNBNftsPurchased = ZERO_BD;
    user.totalVolumeInBNBPaywallsPurchased = ZERO_BD;
    user.totalVolumeInBNBNftsSold = ZERO_BD;
    user.totalVolumeInBNBTokensSold = ZERO_BD;
    user.totalVolumeInBNBPaywallsSold = ZERO_BD;
    user.totalFeesCollectedInBNB = ZERO_BD;
    user.averageTokenPriceInBNBPurchased = ZERO_BD;
    user.averagePaywallPriceInBNBPurchased = ZERO_BD;
    user.averageNftPriceInBNBPurchased = ZERO_BD;
    user.averageTokenPriceInBNBSold = ZERO_BD;
    user.averagePaywallPriceInBNBSold = ZERO_BD;
    user.averageNftPriceInBNBSold = ZERO_BD;
    user.save();
  }
  user.totalFeesCollectedInBNB = user.totalFeesCollectedInBNB.plus(toBigDecimal(event.params.amount, 18));
  user.save();
}

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {  
  log.warning("handleUpdateMiscellaneous7===============> - #{}", [event.params.paramValue2.toString() + "-" + event.params.paramValue]);
  if (event.params.idx.equals(ZERO_BI)) {
    log.warning("handleUpdateMiscellaneous5===============> - #{}", [event.params.collectionId.toString() + "-" + event.params.paramName]);
    log.warning("handleUpdateMiscellaneous6===============> - #{}", [event.params.collectionId.toString() + "-" + event.params.paramName + "-" + event.params.paramValue + "-paywall"]);
    let paywall = Paywall.load(event.params.collectionId.toString() + "-" + event.params.paramName);
    let sharedPaywall = Paywall.load(event.params.paramValue2.toString() + "-" + event.params.paramValue);
    if (paywall !== null && sharedPaywall !== null) {
      log.warning("handleUpdateMiscellaneous7===============> - #{}", ["7"]);
      let paywallMirror = PaywallMirror.load(event.params.collectionId.toString() + "-" + event.params.paramName + "-" + event.params.paramValue + "-paywall");
      if (paywallMirror === null) {
        log.warning("handleUpdateMiscellaneous8===============> - #{}", ["8"]);
        paywallMirror = new PaywallMirror(event.params.collectionId.toString() + "-" + event.params.paramName + "-" + event.params.paramValue + "-paywall");
        paywallMirror.paywall = paywall.id;
        paywallMirror.sharedPaywall = sharedPaywall.id;
        paywallMirror.createdAt = event.block.timestamp;
        paywallMirror.active = event.params.paramValue3.gt(ZERO_BI);
        paywall.save()
        paywallMirror.save()
      } else {
        log.warning("handleUpdateMiscellaneous9==========> - #{}", ["9"]);
        paywallMirror.updatedAt = event.block.timestamp;
        paywallMirror.endTime = event.params.paramValue3;
        paywallMirror.save();
      }
    }
  } else if (event.params.idx.equals(ONE_BI)) {
    let paywall = Paywall.load(event.params.collectionId.toString() + "-" + event.params.paramName);
    if (paywall !== null) {
      paywall.canPublish = event.params.paramValue2.equals(ONE_BI) ? true : false;
      paywall.save();
    }
  } else if (event.params.idx.equals(THREE_BI) || event.params.idx.equals(SIX_BI)) {
      let paywall = Paywall.load(event.params.collectionId.toString() + "-" + event.params.paramName);
      let item = NFT.load(event.params.collectionId.toString() + "-" + event.params.paramValue);
      if (item !== null) {
        let paywallMirror = PaywallMirror.load(event.params.collectionId.toString() + "-" + event.params.paramName + "-" + event.params.paramValue + "-nft");
        if (paywallMirror === null && event.params.idx.equals(THREE_BI)) {
          paywallMirror = new PaywallMirror(event.params.collectionId.toString() + "-" + event.params.paramName + "-" + event.params.paramValue + "-nft");
          paywallMirror.paywall = paywall.id;
          paywallMirror.createdAt = event.block.timestamp;
          if (item.behindPaywall.equals(ZERO_BI)) {
            item.images = event.params.paramValue5;
          }
          item.behindPaywall = item.behindPaywall.plus(ONE_BI) 
          item.save()
          paywallMirror.save();
        }
        if (paywallMirror !== null) {
          paywallMirror.updatedAt = event.block.timestamp;
          paywallMirror.nft = event.params.idx.equals(THREE_BI) ? item.id : '';
          paywallMirror.active = event.params.idx.equals(THREE_BI);
          paywallMirror.partner = true;
          if (event.params.idx.equals(SIX_BI)) {
            if (item.behindPaywall.equals(ONE_BI)) {
              item.images = event.params.paramValue5;
            }
            item.behindPaywall = item.behindPaywall.minus(ONE_BI)
            item.save()
          }
          paywallMirror.save();
        }
      }
  } else if (event.params.idx.equals(TWO_BI) || event.params.idx.equals(FIVE_BI)) {
    let paywall = Paywall.load(event.params.collectionId.toString() + "-" + event.params.paramName);
    let item = Item.load(event.params.collectionId.toString() + "-" + event.params.paramValue);
    if (item !== null) {
      item.images = event.params.paramValue5;
      let paywallMirror = PaywallMirror.load(event.params.collectionId.toString() + "-" + event.params.paramName + "-" + event.params.paramValue + "-item");
      if (paywallMirror === null && event.params.idx.equals(TWO_BI)) {
        paywallMirror = new PaywallMirror(event.params.collectionId.toString() + "-" + event.params.paramName + "-" + event.params.paramValue + "-item");
        paywallMirror.paywall = paywall.id;
        paywallMirror.createdAt = event.block.timestamp;
        if (item.behindPaywall.equals(ZERO_BI)) {
          item.images = event.params.paramValue5;
        }
        item.behindPaywall = item.behindPaywall.plus(ONE_BI) 
        item.save()
        paywallMirror.save();
      }
      if (paywallMirror !== null) {
        paywallMirror.updatedAt = event.block.timestamp;
        paywallMirror.item = event.params.idx.equals(TWO_BI) ? item.id : '';
        paywallMirror.active = event.params.idx.equals(TWO_BI);
        if (event.params.idx.equals(FIVE_BI)) {
          if (item.behindPaywall.equals(ONE_BI)) {
            item.images = event.params.paramValue5;
          }
          item.behindPaywall = item.behindPaywall.minus(ONE_BI)
          item.save()
        }
        paywallMirror.save();
      }
    }
  } else if (event.params.idx.equals(FOUR_BI) || event.params.idx.equals(SEVEN_BI)) {
    let paywall = Paywall.load(event.params.collectionId.toString() + "-" + event.params.paramName);
    let ppaywall = Paywall.load(event.params.collectionId.toString() + "-" + event.params.paramValue);
    if (ppaywall !== null) {
      let paywallMirror = PaywallMirror.load(event.params.collectionId.toString() + "-" + event.params.paramName + "-" + event.params.paramValue + "-paywall");
      if (paywallMirror === null && event.params.idx.equals(TWO_BI)) {
        paywallMirror = new PaywallMirror(event.params.collectionId.toString() + "-" + event.params.paramName + "-" + event.params.paramValue + "-paywall");
        paywallMirror.paywall = paywall.id;
        paywallMirror.createdAt = event.block.timestamp;
        paywallMirror.save();
      }
      if (paywallMirror !== null) {
        paywallMirror.updatedAt = event.block.timestamp;
        paywallMirror.partnerPaywall = event.params.idx.equals(FOUR_BI) ? ppaywall.id : '';
        paywallMirror.active = event.params.idx.equals(FOUR_BI);
        paywallMirror.save();
      }
    }
  } else if (event.params.idx.equals(EIGHT_BI) || event.params.idx.equals(NINE_BI)) {
    let collection = Collection.load(event.params.collectionId.toString());
    let paywall = Paywall.load(event.params.paramValue2.toString() + "-" + event.params.paramName.toString());
    if (collection !== null && paywall !== null) {
      let mirror = Mirror.load(event.params.paramValue2.toString() + "-" + event.params.paramName.toString());
      if (mirror !== null) {
        mirror.item = '';
        mirror.nft = '';
        mirror.paywall = '';
        if (event.params.idx.equals(NINE_BI)) {
          mirror.registration = '';
          mirror.active = false;
        }
        mirror.save();
      }
      collection.numberPartnerPaywallsListed = collection.numberPartnerPaywallsListed.minus(ONE_BI);
      collection.save();
    }
  }
}