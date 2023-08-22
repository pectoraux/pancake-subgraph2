/* eslint-disable prefer-const */
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Protocol, World, Vote, WorldNFT, Note, Tag } from "../generated/schema";
import {
  Voted,
  Mint,
  CreateWorld,
  DeleteWorld,
  UpdateAutoCharge,
  UpdateProtocol,
  DeleteProtocol,
  UpdateMiscellaneous,
} from "../generated/worlds/worlds";
import { fetchTokenURI, fetchNoteURI } from "./utils/erc721";

let ZERO_BI = BigInt.fromI32(0);
let THREE_BI = BigInt.fromI32(3);
let FOUR_BI = BigInt.fromI32(4);
let WORLD_HELPER2 = "0x350ab48ad25003d1887a17d269f947f7dd27a2c8";
let WORLD_HELPER3 = "0x29cf710fa955e4f3a6e8e672d4885fd9a43f380f";

export function handleUpdateProtocol(event: UpdateProtocol): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.world.toHex());
  if (protocol === null) {
    protocol = new Protocol(event.params.protocolId.toString() + '_' + event.params.world.toHex());
    protocol.active = true;
    protocol.world = event.params.world.toHex();
    protocol.token = event.params.token.toHex();
  }
  protocol.owner = event.params.owner.toHex();
  protocol.description = event.params.description;
  protocol.media = event.params.media;
  protocol.rating = event.params.rating;
  protocol.save();
}

export function handleUpdateAutoCharge(event: UpdateAutoCharge): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.world.toHex());
  if (protocol !== null) {
    protocol.autoCharge = event.params.isAutoChargeable;
    protocol.save();
  }
}

export function handleMint(event: Mint): void {
  let worldNFT = WorldNFT.load(event.params.tokenId.toString() + '_' + event.params.world.toHex());
  if (worldNFT === null) {
    worldNFT = new WorldNFT(event.params.tokenId.toString() + '_' + event.params.world.toHex());
    let uri = fetchTokenURI(Address.fromString(WORLD_HELPER2), event.params.tokenId);
    log.warning("uri2===============> - #{}", [uri]);
    if (uri !== null) {
      worldNFT.metadataUrl = uri;
    }
    worldNFT.tokenId = event.params.tokenId;
    worldNFT.world = event.params.world.toHex();
    log.warning("handleMint===============> - #{}", [uri]);
    worldNFT.save();
  }
}

export function handleDeleteProtocol(event: DeleteProtocol): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.world.toHex());
  if (protocol !== null) {
    protocol.active = false;
    protocol.world = '';
    protocol.save();
  }
}

export function handleVoted(event: Voted): void {
  let world = World.load(event.params.world.toHex());
  if (world !== null) {
      let vote = Vote.load(event.params.world.toHex() + "-" + event.params.profileId.toString());
      if (vote === null) {
        vote = new Vote(event.params.world.toHex() + "-" + event.params.profileId.toString());
        vote.profileId = event.params.profileId;
        vote.createdAt = event.block.timestamp;
        vote.world = world.id;
      }
      vote.updatedAt = event.block.timestamp;
      vote.liked = event.params.like;
      vote.save();
      world.likes = event.params.likes;
      world.dislikes = event.params.dislikes;
      world.save();
  }
}

export function handleCreateWorld(event: CreateWorld): void {
  let world = World.load(event.params.world.toHex());
  if (world === null) {
    world = new World(event.params.world.toHex());
    world.profileId = event.params.profileId;
    world.owner = event.params.user.toHexString();
    world.likes = ZERO_BI;
    world.dislikes = ZERO_BI;
    world.save();
  }
}

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {
  if (event.params.idx.equals(ZERO_BI)) {
    let world = World.load(event.params.paramValue4.toHex());
    if (world !== null && event.params.sender.equals(Address.fromString(world.owner)) ) {
      world.applicationLink = event.params.paramName;
      world.save();
    }
  } else if (event.params.idx.equals(THREE_BI)) {
    let world = World.load(event.params.paramValue4.toHex());
    if (world !== null) {
      let note = Note.load(event.params.paramValue2.toString());
      if (note === null) {
        note = new Note(event.params.paramValue2.toString());
        note.createdAt = event.block.timestamp;
        note.world = world.id;
      }
      let uri = fetchNoteURI(Address.fromString(WORLD_HELPER3), event.params.paramValue2);
      log.warning("uri2===============> - #{}", [uri]);
      if (uri !== null) {
        note.metadataUrl = uri;
      }
      note.save();
    }
  } else if (event.params.idx.equals(FOUR_BI)) {
    let world = World.load(event.params.paramValue4.toHex());
    if (world !== null) {
      if (event.params.sender.equals(Address.fromString(world.owner))) {
        world.countries = event.params.paramName;
        world.cities = event.params.paramValue;
        world.products = event.params.paramValue5;
        world.save();
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

export function handleDeleteWorld(event: DeleteWorld): void {
  let world = World.load(event.params.world.toHexString());
  if (world !== null) {
    world.active = false;
    world.save();
  }
}