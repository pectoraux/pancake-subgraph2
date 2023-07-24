/* eslint-disable prefer-const */
import { BigInt } from "@graphprotocol/graph-ts";
import { Proposal, Vote, Valuepool } from "../generated/schema";
import {
  GaugeCreated,
  UpdateTags,
  Voted,
  AddVa
} from "../generated/ValuepoolVoter/ValuepoolVoter";

let ZERO_BI = BigInt.fromI32(0);

export function handleAddVa(event: AddVa): void {
  let valuepool = Valuepool.load(event.params.vava.toHexString());
  if (valuepool === null) {
    valuepool = new Valuepool(event.params.vava.toHexString());
    valuepool.created = event.block.timestamp;
  }
  valuepool.updated = event.block.timestamp;
  valuepool.period = event.params.period;
  valuepool.minPeriod = event.params.minPeriod;
  valuepool.minDifference = event.params.minDifference;
  if (valuepool.collectionId === null || valuepool.collectionId.equals(ZERO_BI)) {
    valuepool.collectionId = event.params.collectionId;
  }
  valuepool.minBountyRequired = event.params.minBountyRequired;
  valuepool.minimumLockValue = event.params.minimumLockValue;
  valuepool.voteOption = event.params.voteOption === 0
  ? "Percentile" 
  : event.params.voteOption === 1
  ? "VotingPower"
  : "Unique"
  valuepool.save();
}

export function handleGaugeCreated(event: GaugeCreated): void {
  let proposal = Proposal.load(event.params.ve.toHexString() + "-" + event.params.pool.toHexString());
  if (proposal === null) {
    proposal = new Proposal(event.params.ve.toHexString() + "-" + event.params.pool.toHexString());
    proposal.valuepool = event.params.ve.toHexString();
    proposal.amount = event.params.amount;
    proposal.endTime = event.params.endTime;
    proposal.title = event.params.title;
    proposal.description = event.params.content;
    proposal.owner = event.params.user.toHexString();
    proposal.created = event.block.timestamp;
    proposal.updated = event.block.timestamp;
    proposal.upVotes = ZERO_BI;
    proposal.downVotes = ZERO_BI;
    proposal.active = true;
    proposal.save();
  }
}

export function handleUpdateTags(event: UpdateTags): void {
  let proposal = Proposal.load(event.params.ve.toHexString() + "-" + event.params.pool.toHexString());
  if (proposal !== null) {
    proposal.countries = event.params.countries;
    proposal.cities = event.params.cities;
    proposal.products = event.params.products;
    proposal.save();
  }
}

export function handleVoted(event: Voted): void {
  let proposal = Proposal.load(event.params.ve.toHexString() + "-" + event.params.pool.toHexString());
  if (proposal !== null) {
    let vote = Vote.load(event.params.ve.toHexString() + "-" + event.params.pool.toHexString() + '-' + event.params.profileId.toString());
    if (vote === null) {
      vote = new Vote(event.params.ve.toHexString() + "-" + event.params.pool.toHexString() + '-' + event.params.profileId.toString());
      vote.created = event.block.timestamp;
    }
    vote.profileId = event.params.profileId;
    vote.tokenId = event.params.tokenId;
    vote.identityTokenId = event.params._identityTokenId;
    vote.ve = event.params.ve.toHexString();
    vote.like = event.params.like;
    vote.proposal = proposal.id;
    vote.updated = event.block.timestamp;
    vote.votingPower = event.params.weight;
    vote.save();
    if (event.params.like) {
      proposal.upVotes = proposal.upVotes.plus(event.params.weight)
    } else {
      proposal.downVotes = proposal.downVotes.plus(event.params.weight)
    }
    proposal.save();
  }
}