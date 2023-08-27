/* eslint-disable prefer-const */
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Protocol, Game, GameObject } from "../generated/schema";
import {
  UpdateTokenId,
  AddProtocol,
  MintObject,
  UpdateProtocol,
  UpdateOwner,
  DeleteGame,
  BuyGameTicket,
  UpdateMiscellaneous,
} from "../generated/GameFactory/gameFactory";
import { fetchTokenURI } from "./utils/erc721";

let ZERO_BI = BigInt.fromI32(0);
let ONE_BI = BigInt.fromI32(1);
let THREE_BI = BigInt.fromI32(3);
let GAME_HELPER = "0x6Ff847c7EbDf92bA9E6D1DBD9c172d912f61C4D4";
let GAME_MINTER = "0x45160ea1079e7a07160c2ea122a760cee0ffcc71";
let GAME_HELPER_LOWERCASE = "0x6ff847c7ebdf92ba9e6d1dbd9c172d912f61c4d4";

export function handleMintObject(event: MintObject): void {
  log.warning("handleMintObject===============> - #{}", ["1"]);
}

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {
  log.warning("handleUpdateMiscellaneous===============> - #{}", ["1"]);
  let game = Game.load(event.params.collectionId.toString());
  if (game !== null) {
    if (event.params.sender.equals(Address.fromString(GAME_HELPER)) ||
        event.params.sender.equals(Address.fromString(GAME_MINTER))
    ) {
    log.warning("handleUpdateMiscellaneous===============> - #{}", ["2"]);
        if (event.params.idx.equals(ONE_BI)) { // add
          let object = GameObject.load(event.params.collectionId.toString() + '-' + event.params.paramName);
          if (object === null) {
            object = new GameObject(event.params.collectionId.toString() + '-' + event.params.paramName);
            object.name = event.params.paramName;
            object.active = true;
            object.game = game.id;
            object.createdAt = event.block.timestamp;
            object.updatedAt = event.block.timestamp;
            object.save();
          }
        } else if (event.params.idx.equals(ZERO_BI)) { // remove
          let object = GameObject.load(event.params.collectionId.toString() + '-' + event.params.paramName);
          if (object !== null) {
            object.active = true;
            object.game = '';
            object.updatedAt = event.block.timestamp;
            object.save();
          }
        } else if (event.params.idx.equals(THREE_BI)) { // mint
          log.warning("handleUpdateMiscellaneous===============> - #{}", ["3"]);
          let protocol = Protocol.load(event.params.paramValue2.toString());
          if (protocol === null) {
            protocol = new Protocol(event.params.paramValue2.toString());
            protocol.active = true;
            protocol.game = game.id;
            protocol.owner = event.params.paramValue4.toHexString();
          }
          let uri = fetchTokenURI(Address.fromString(GAME_HELPER), event.params.paramValue2);
          log.warning("uri2===============> - #{}", [uri]);
          if (uri !== null) {
            protocol.metadataUrl = uri;
          }
          protocol.save();
        }
    } else  if (event.params.sender.equals(Address.fromString(game.owner))) {
      game.gameName = event.params.paramValue;
      game.gameLink = event.params.paramName;
      game.save();
    }
  }
}

export function handleAddProtocol(event: AddProtocol): void {
  let game = Game.load(event.params.collectionId.toString());
  if (game === null) {
    game = new Game(event.params.collectionId.toString());
    game.owner = event.params.user.toHex();
    game.token = event.params.token.toHexString();
    game.gameContract = event.params.gameContract.toHexString();
    game.pricePerMinutes = event.params.pricePerMinutes;
    game.creatorShare = event.params.creatorShare;
    game.referrerFee = event.params.referrerFee;
    game.teamShare = event.params.teamShare;
    game.claimable = event.params.claimable;
    game.createdAt = event.block.timestamp;
    game.updatedAt = event.block.timestamp;
    game.save();
  }
}

export function handleUpdateProtocol(event: UpdateProtocol): void {
  let game = Game.load(event.params.collectionId.toString());
  if (game !== null) {
    game.owner = event.params.owner.toHex();
    game.gameContract = event.params.gameContract.toHex();
    game.pricePerMinutes = event.params.pricePerMinutes;
    game.creatorShare = event.params.creatorShare;
    game.referrerFee = event.params.referrerFee;
    game.teamShare = event.params.teamShare;
    game.claimable = event.params.claimable;
    game.updatedAt = event.block.timestamp;
    game.save();
  }
}

export function handleDeleteGame(event: DeleteGame): void {
  let game = Game.load(event.params.collectionId.toString());
  if (game !== null) {
    game.active = false;
    game.save();
  }
}

export function handleUpdateTokenId(event: UpdateTokenId): void {
  let game = Game.load(event.params.collectionId.toString());
  if (game !== null) {
    game.tokenId = event.params.tokenId;
    game.save();
  }
}

export function handleUpdateOwner(event: UpdateOwner): void {
  let game = Game.load(event.params.collectionId.toString());
  if (game !== null) {
    game.owner = event.params.owner.toHex();
    game.save();
  }
}

export function handleBuyGameTicket(event: BuyGameTicket): void {
  let game = Game.load(event.params.collectionId.toString());
  if (game !== null) {
    let protocol = Protocol.load(event.params.tokenId.toString());
    if (protocol === null) {
      protocol = new Protocol(event.params.tokenId.toString());
      protocol.game = game.id;
    }
    protocol.owner = event.params.user.toHex();
    protocol.minutes = event.params.numMinute;
    protocol.save();
  }
}