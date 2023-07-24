/* eslint-disable prefer-const */
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Protocol, Sponsor, Vote, ContentType, Note } from "../generated/schema";
import {
  Voted,
  CreateSponsorship,
  UpdateProtocol,
  DeleteProtocol,
  UpdateContents,
  DeleteSponsor,
  UpdateMiscellaneous,
} from "../generated/sponsors/sponsors";
import { fetchNoteURI } from "./utils/erc721";

let ZERO_BI = BigInt.fromI32(0);
let ONE_BI = BigInt.fromI32(1);
let SPONSOR_NOTE = "0xdf1fd12d700110cf763a540e059349ce4a453c5a";

export function handleUpdateProtocol(event: UpdateProtocol): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.sponsor.toHexString());
  if (protocol === null) {
    protocol = new Protocol(event.params.protocolId.toString() + '_' + event.params.sponsor.toHexString());
    protocol.active = true;
    protocol.sponsor = event.params.sponsor.toHexString();
  }
  protocol.active = true;
  protocol.owner = event.params.owner.toHexString();
  protocol.description = event.params.description;
  protocol.media = event.params.media;
  protocol.save();
}

export function handleDeleteProtocol(event: DeleteProtocol): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.sponsor.toHexString());
  if (protocol !== null) {
    protocol.active = false;
    protocol.sponsor = '';
    protocol.save();
  }
}

export function handleDeleteSponsor(event: DeleteSponsor): void {
  let sponsor = Sponsor.load(event.params.sponsor.toHexString());
  if (sponsor !== null) {
    sponsor.active = false;
    sponsor.save();
  }
}

export function handleVoted(event: Voted): void {
  let sponsor = Sponsor.load(event.params.sponsor.toHexString());
  if (sponsor !== null) {
    let vote = Vote.load(event.params.sponsor.toHexString() + "-" + event.params.profileId.toString());
    if (vote === null) {
      vote = new Vote(event.params.sponsor.toHexString() + "-" + event.params.profileId.toString());
      vote.profileId = event.params.profileId;
      vote.createdAt = event.block.timestamp;
      vote.sponsor = sponsor.id;
    }
    vote.updatedAt = event.block.timestamp;
    vote.liked = event.params.like;
    vote.save();
    sponsor.save();
  }
}

export function handleCreateSponsorship(event: CreateSponsorship): void {
  log.warning("handleCreateSponsorship===============> - #{}", [event.params.sponsor.toHexString()]);
  let sponsor = Sponsor.load(event.params.sponsor.toHexString());
  if (sponsor === null) {
    sponsor = new Sponsor(event.params.sponsor.toHexString());
    sponsor.likes = ZERO_BI;
    sponsor.dislikes = ZERO_BI;
    sponsor.active = true;
    sponsor.owner = event.params.user.toHexString();
    sponsor.profileId = event.params.profileId;
    sponsor.save();
  }
}

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {
  log.warning("zero_bi===============> - #{}", [event.params.idx.equals(ZERO_BI) ? "true" : "false"]);
  if (event.params.idx.equals(ONE_BI)) {
    let protocol = Protocol.load(event.params.collectionId.toString() + '_' + event.params.paramValue4.toHex());
    if (protocol !== null) {
      let note = Note.load(event.params.paramValue2.toString());
      if (note === null) {
        note = new Note(event.params.paramValue2.toString());
        note.createdAt = event.block.timestamp;
        note.updatedAt = event.block.timestamp;
        note.protocol = protocol.id;
      }
      let uri = fetchNoteURI(Address.fromString(SPONSOR_NOTE), event.params.paramValue2);
      log.warning("uri2===============> - #{}", [uri]);
      if (uri !== null) {
        note.metadataUrl = uri;
      }
      note.save();
    }
  }
}

export function handleUpdateContents(event: UpdateContents): void {
  let sponsor = Sponsor.load(event.params.sponsor.toHexString());
  if (sponsor === null) {
  let content = ContentType.load(event.params.contentName);
    if (content === null) {
      content = new ContentType(event.params.contentName);
      content.name = event.params.contentName;
      content.sponsor = event.params.sponsor.toHexString();
      content.active = event.params.add;
      content.save()
    } else {
      content.active = event.params.add;
      content.save()
    }
  }
}