/* eslint-disable prefer-const */
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Protocol, Auditor, Vote, Note, Token, Tag } from "../generated/schema";
import {
  Voted,
  UpdateAutoCharge,
  CreateAuditor,
  UpdateProtocol,
  DeleteProtocol,
  DeleteAuditor,
  UpdateMiscellaneous,
} from "../generated/auditors/auditors";
import { fetchTokenURI, fetchNoteURI } from "./utils/erc721";

let ZERO_BI = BigInt.fromI32(0);
let ONE_BI = BigInt.fromI32(1);
let TWO_BI = BigInt.fromI32(2);
let THREE_BI = BigInt.fromI32(3);

let AUDITOR_NOTE = "0x51ccf98593809607bdb08509e8b8d670658f86c0";
let AUDITOR_HELPER = "0xee0a3de3952b71cfadaa155182878ed49a6d93a2";

export function handleUpdateProtocol(event: UpdateProtocol): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.auditor.toHex());
  if (protocol === null) {
    protocol = new Protocol(event.params.protocolId.toString() + '_' + event.params.auditor.toHex());
    protocol.active = true;
    protocol.autoCharge = false;
  }
  protocol.owner = event.params.owner.toHex();
  protocol.auditor = event.params.auditor.toHex();
  protocol.ratings = event.params.ratings;
  protocol.esgRating = event.params.esgRating;
  protocol.description = event.params.description;
  protocol.media = event.params.media;
  let token = Token.load(event.params.protocolId.toString());
  if (token === null) {
    token = new Token(event.params.protocolId.toString());
    token.createdAt = event.block.timestamp;
  }
  let uri = fetchTokenURI(Address.fromString(AUDITOR_HELPER), event.params.protocolId);
  log.warning("uri1===============> - #{}", [uri]);
  if (uri !== null) {
    token.metadataUrl = uri;
    token.protocol = protocol.id;
  }
  token.save();
  protocol.save();
}

export function handleUpdateAutoCharge(event: UpdateAutoCharge): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.auditor.toHex());
  if (protocol !== null) {
    protocol.autoCharge = event.params.isAutoChargeable;
    protocol.save();
  }
}

export function handleDeleteProtocol(event: DeleteProtocol): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.auditor.toHex());
  if (protocol !== null) {
    protocol.active = false;
    protocol.save();
  }
}

export function handleDeleteAuditor(event: DeleteAuditor): void {
  let auditor = Auditor.load(event.params.auditor.toHexString());
  if (auditor !== null) {
    auditor.active = false;
    auditor.save();
  }
}

export function handleVoted(event: Voted): void {
  let auditor = Auditor.load(event.params.auditor.toHex());
  if (auditor !== null) {
      let vote = Vote.load(event.params.auditor.toHex() + "-" + event.params.profileId.toString());
      if (vote === null) {
        vote = new Vote(event.params.auditor.toHex() + "-" + event.params.profileId.toString());
        vote.profileId = event.params.profileId;
        vote.createdAt = event.block.timestamp;
        vote.auditor = auditor.id;
      }
      vote.updatedAt = event.block.timestamp;
      vote.liked = event.params.like;
      vote.save();
      auditor.likes = event.params.likes;
      auditor.dislikes = event.params.dislikes;
      auditor.save();
  }
}

export function handleCreateAuditor(event: CreateAuditor): void {
  let auditor = Auditor.load(event.params.auditor.toHex());
  if (auditor === null) {
    auditor = new Auditor(event.params.auditor.toHex());
    auditor.profileId = event.params.profileId;
    auditor.owner = event.params.user.toHexString();
    auditor.likes = ZERO_BI;
    auditor.dislikes = ZERO_BI;
    auditor.save();
  }
}

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {
  if (event.params.idx.equals(ZERO_BI)) {
    let auditor = Auditor.load(event.params.paramValue4.toHex());
    if (auditor !== null && event.params.sender.equals(Address.fromString(auditor.owner)) ) {
      auditor.contactChannels = event.params.paramName;
      auditor.contacts = event.params.paramValue;
      auditor.applicationLink = event.params.paramValue5;
      auditor.save();
    }
  } else if (event.params.idx.equals(ONE_BI)) {
      let auditor = Auditor.load(event.params.paramValue4.toHex());
        if (auditor !== null) {
          if (event.params.sender.equals(Address.fromString(auditor.owner))) {
            auditor.countries = event.params.paramName;
            auditor.cities = event.params.paramValue;
            auditor.products = event.params.paramValue5;
            auditor.save();
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
  } else if (event.params.idx.equals(THREE_BI)) {
    log.warning("uri00===============> - #{} - #{}", [event.params.auditorId.toString(), event.params.paramValue2.toString()]);
    log.warning("uri000===============> - #{} - #{}", [event.params.idx.toString(),  event.params.paramValue4.toHex()]);

    let auditor = Auditor.load(event.params.paramValue4.toHex());
    if (auditor !== null) {
      let note = Note.load(event.params.paramValue2.toString());
      if (note === null) {
        note = new Note(event.params.paramValue2.toString());
        note.createdAt = event.block.timestamp;
        note.auditor = auditor.id;
      }
      let uri = fetchNoteURI(Address.fromString(AUDITOR_NOTE), event.params.paramValue2);
      log.warning("uri2===============> - #{}", [uri]);
      if (uri !== null) {
        note.metadataUrl = uri;
      }
      note.save();
    }
  }
}