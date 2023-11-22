/* eslint-disable prefer-const */
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Protocol, ARP, Vote, Note, Tag } from "../generated/schema";
import {
  Voted,
  UpdateAutoCharge,
  CreateARP,
  UpdateProtocol,
  DeleteProtocol,
  DeleteARP,
  UpdateMiscellaneous,
  TransferDueToNote,
} from "../generated/arps/arpHelper";
import { fetchTokenURI, fetchNoteURI } from "./utils/erc721";

let ZERO_BI = BigInt.fromI32(0);
let ONE_BI = BigInt.fromI32(0); 
let ARP_HELPER = "0x79f85d94a346002d55e14bbb115a607a455e6f8f";
let ARP_NOTE = "0x79eb1063000aa15ef5b73f182793835749188acb";

export function handleUpdateProtocol(event: UpdateProtocol): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.arp.toHex());
  if (protocol === null) {
    protocol = new Protocol(event.params.protocolId.toString() + '_' + event.params.arp.toHex());
    protocol.optionId = event.params.optionId;
    protocol.autoCharge = false;
    protocol.token = event.params.token.toHex();
  }
  let uri = fetchTokenURI(Address.fromString(ARP_HELPER), event.params.protocolId);
  if (uri !== null) {
    protocol.metadataUrl = uri;
    log.warning("uri1===============> - #{}", [uri]);
  }
  protocol.active = true;
  protocol.owner = event.params.owner.toHex();
  protocol.arp = event.params.arp.toHex();
  protocol.description = event.params.description;
  protocol.media = event.params.media;
  protocol.save();
}

export function handleUpdateAutoCharge(event: UpdateAutoCharge): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.arp.toHex());
  if (protocol !== null) {
    protocol.autoCharge = event.params.isAutoChargeable;
    protocol.save();
  }
}

export function handleDeleteProtocol(event: DeleteProtocol): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.arp.toHex());
  if (protocol !== null) {
    protocol.active = false;
    protocol.save();
  }
}

export function handleTransferDueToNote(event: TransferDueToNote): void {
  let arp = ARP.load(event.params.arp.toHex());
  if (arp !== null) {
    let note = Note.load(event.params.tokenId.toString());
    if (note === null) {
      note = new Note(event.params.tokenId.toString());
      note.createdAt = event.block.timestamp;
      note.updatedAt = event.block.timestamp;
    }
    let uri = fetchNoteURI(Address.fromString(ARP_NOTE), event.params.tokenId);
    if (uri !== null) {
      note.metadataUrl = uri;
      log.warning("uri1===============> - #{}", [uri]);
    }
    if (event.params.adminNote) {
      note.arp = arp.id;
      note.save();
    } else {
      let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.arp.toHex());
      if (protocol !== null) {
        note.protocol = protocol.id;
        note.save();
      }
    }
  }
}

export function handleDeleteARP(event: DeleteARP): void {
  let arp = ARP.load(event.params.arp.toHex());
  if (arp !== null) {
    arp.active = false;
    arp.save();
  }
}

export function handleVoted(event: Voted): void {
  let arp = ARP.load(event.params.arp.toHex());
  if (arp !== null) {
      let vote = Vote.load(event.params.arp.toHex() + "-" + event.params.profileId.toString());
      if (vote === null) {
        vote = new Vote(event.params.arp.toHex() + "-" + event.params.profileId.toString());
        vote.profileId = event.params.profileId;
        vote.createdAt = event.block.timestamp;
        vote.arp = arp.id;
      }
      vote.updatedAt = event.block.timestamp;
      vote.liked = event.params.like;
      vote.save();
      arp.likes = event.params.likes;
      arp.dislikes = event.params.dislikes;
      arp.save();
  }
}

export function handleCreateARP(event: CreateARP): void {
  let arp = ARP.load(event.params.arp.toHex());
  if (arp === null) {
    arp = new ARP(event.params.arp.toHex());
    arp.profileId = event.params.profileId;
    arp.owner = event.params._user.toHexString();
    arp.likes = ZERO_BI;
    arp.dislikes = ZERO_BI;
    arp.save();
  }
}

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {
  if (event.params.idx.equals(ZERO_BI)) {
    let arp = ARP.load(event.params.paramValue4.toHex());
    if (arp !== null && event.params.sender.equals(Address.fromString(arp.owner)) ) {
      arp.contactChannels = event.params.paramName;
      arp.contacts = event.params.paramValue;
      arp.applicationLink = event.params.paramValue5;
      arp.save();
    }
  } else if (event.params.idx.equals(ONE_BI)) {
    let arp = ARP.load(event.params.paramValue4.toHex());
    if (arp !== null) {
      if (event.params.sender.equals(Address.fromString(arp.owner))) {
        arp.countries = event.params.paramName;
        arp.cities = event.params.paramValue;
        arp.products = event.params.paramValue5;
        arp.save();
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