/* eslint-disable prefer-const */
import { BigInt, log } from "@graphprotocol/graph-ts";
import { Pitch, Vote } from "../generated/schema";
import {
  GaugeCreated,
  UpdateContent,
  DeactivatePitch,
  Voted,
} from "../generated/AcceleratorVoter/AcceleratorVoter";

let ZERO_BI = BigInt.fromI32(0);

export function handleGaugeCreated(event: GaugeCreated): void {
  log.warning("handleGaugeCreated===============> - #{}", [event.params.pool.toHexString()]);
  let pitch = Pitch.load(event.params.pool.toString());
  if (pitch === null) {
    pitch = new Pitch(event.params.pool.toString());
    pitch.upVotes = ZERO_BI;
    pitch.downVotes = ZERO_BI;
  }
  pitch.active = true;
  pitch.creationTime = event.block.timestamp;
  pitch.ve = event.params._ve.toHexString();
  pitch.gauge = event.params.gauge.toHexString();
  pitch.bribe = event.params.bribe.toHexString();
  pitch.owner = event.params.creator.toHexString();
  pitch.save();
}

export function handleUpdateContent(event: UpdateContent): void {
  let pitch = Pitch.load(event.params.collectionId.toString());
  if (pitch !== null) {
    pitch.title = event.params.title;
    pitch.description = event.params.content;
    pitch.images = event.params.images;
    pitch.save();
  }
}

export function handleVoted(event: Voted): void {
  let pitch = Pitch.load(event.params.collectionId.toString());
  if (pitch !== null) {
    let vote = Vote.load(event.params.collectionId.toString() + '-' + event.params.tokenId.toString());
    if (vote === null) {
      vote = new Vote(event.params.collectionId.toString() + '-' + event.params.tokenId.toString());
      vote.tokenId = event.params.tokenId;
      vote.like = event.params.positive;
      vote.pitch = event.params.collectionId.toString();
      vote.created = event.block.timestamp;
      vote.votingPower = event.params.weight.abs();
      vote.ve = event.params.ve.toHexString();
      vote.save();
    }
      vote.like = event.params.positive;
      vote.tokenId = event.params.tokenId;
      vote.pitch = event.params.collectionId.toString();
      vote.created = event.block.timestamp;
      vote.votingPower = event.params.weight.abs();
      vote.ve = event.params.ve.toHexString();
      vote.save();
    if (event.params.positive) {
      pitch.upVotes = pitch.upVotes.plus(event.params.weight.abs())
    } else {
      pitch.downVotes = pitch.downVotes.plus(event.params.weight.abs())
    }
    pitch.save();
  }
}

export function handleDeactivatePitch(event: DeactivatePitch): void {
  let pitch = Pitch.load(event.params.collectionId.toString());
  if (pitch !== null) {
    pitch.active = false;
    pitch.save();
  }
}