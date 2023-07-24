/* eslint-disable prefer-const */
import { BigInt } from "@graphprotocol/graph-ts";
import { Collection, Vote } from "../generated/schema";
import {
  GaugeCreated,
  DeactivateGauge,
  Voted,
} from "../generated/BusinessVoter/BusinessVoter";

let ZERO_BI = BigInt.fromI32(0);

export function handleGaugeCreated(event: GaugeCreated): void {
  let collection = Collection.load(event.params.pool.toString());
  if (collection === null) {
    collection = new Collection(event.params.pool.toString());
    collection.ve = event.params._ve.toHexString();
    collection.gauge = event.params.gauge.toHexString();
    collection.bribe = event.params.bribe.toHexString();
    collection.owner = event.params.creator.toHexString();
    collection.creationTime = event.block.timestamp;
    collection.upVotes = ZERO_BI;
    collection.active = true;
    collection.save();
  }
  collection.active = true;
  collection.creationTime = event.block.timestamp;
  collection.ve = event.params._ve.toHexString();
  collection.gauge = event.params.gauge.toHexString();
  collection.bribe = event.params.bribe.toHexString();
  collection.owner = event.params.creator.toHexString();
  collection.save();
}

export function handleVoted(event: Voted): void {
  let collection = Collection.load(event.params._collectionId.toString());
  if (collection !== null) {
    let vote = Vote.load(event.params._collectionId.toString() + '-' + event.params.tokenId.toString());
    if (vote === null) {
      vote = new Vote(event.params._collectionId.toString() + '-' + event.params.tokenId.toString());
      vote.tokenId = event.params.tokenId;
      vote.collection = event.params._collectionId.toString();
      vote.created = event.block.timestamp;
      vote.votingPower = event.params.weight;
      vote.ve = event.params._ve.toHexString();
      vote.voter = event.params.voter.toHexString();
      vote.save();
    }
    vote.tokenId = event.params.tokenId;
    vote.collection = event.params._collectionId.toString();
    vote.created = event.block.timestamp;
    vote.votingPower = event.params.weight;
    vote.ve = event.params._ve.toHexString();
    vote.voter = event.params.voter.toHexString();
    vote.save();
    collection.upVotes = collection.upVotes.plus(event.params.weight)
    collection.save();
  }
}

export function handleDeactivateGauge(event: DeactivateGauge): void {
  let collection = Collection.load(event.params.collectionId.toString());
  if (collection !== null) {
    collection.active = false;
    collection.save();
  }
}