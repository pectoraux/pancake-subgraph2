/* eslint-disable prefer-const */
import { BigInt } from "@graphprotocol/graph-ts";
import { Proposal, Vote, Valuepool } from "../generated/schema";
import {
  GaugeCreated,
  UpdateTags,
  Voted,
  AddVa,
  Abstained
} from "../generated/ValuepoolVoter/ValuepoolVoter";

let ZERO_BI = BigInt.fromI32(0);

export function handleAddVa(event: AddVa): void {
  let valuepool = Valuepool.load(event.params.va.toHexString());
  if (valuepool === null) {
    valuepool = new Valuepool(event.params.va.toHexString());
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
  let proposal = Proposal.load(event.params.proposalId.toString());
  if (proposal === null) {
    proposal = new Proposal(event.params.proposalId.toString());
    proposal.valuepool = event.params.ve.toHexString();
    proposal.amount = event.params.amount;
    proposal.endTime = event.params.endTime;
    proposal.title = event.params.title;
    proposal.description = event.params.content;
    proposal.owner = event.params.user.toHexString();
    proposal.pool = event.params.pool.toHexString();
    proposal.created = event.block.timestamp;
    proposal.updated = event.block.timestamp;
    proposal.upVotes = ZERO_BI;
    proposal.downVotes = ZERO_BI;
    proposal.active = true;
    proposal.save();
  }
}

export function handleUpdateTags(event: UpdateTags): void {
  let proposal = Proposal.load(event.params.ve.toHexString() + "-" + event.params.pool.toHexString() + "-" + event.params.title);
  if (proposal !== null) {
    proposal.countries = event.params.countries;
    proposal.cities = event.params.cities;
    proposal.products = event.params.products;
    proposal.save();
  }
}

export function handleVoted(event: Voted): void {
  let proposal = Proposal.load(event.params.proposalId.toString());
  if (proposal !== null) {
    let vote = Vote.load(event.params.proposalId.toString() + "-" + event.params.tokenId.toString());
    if (vote === null) {
      vote = new Vote(event.params.proposalId.toString() + "-" + event.params.tokenId.toString());
      vote.created = event.block.timestamp;
      vote.tokenId = event.params.tokenId;
    }
    vote.profileId = event.params.profileId;
    vote.identityTokenId = event.params._identityTokenId;
    vote.like = event.params.like;
    vote.proposal = proposal.id;
    vote.updated = event.block.timestamp;
    vote.votingPower = event.params.weight;
    vote.save();
    if (event.params.like) {
      proposal.upVotes = proposal.upVotes.plus(event.params.weight.abs())
    } else {
      proposal.downVotes = proposal.downVotes.plus(event.params.weight.abs())
    }
    proposal.save();
  }
}

export function handleAbstained(event: Abstained): void {
  let proposal = Proposal.load(event.params.proposalId.toString());
  let vote = Vote.load(event.params.proposalId.toString() + "-" + event.params.tokenId.toString());
  if (proposal !== null && vote !== null) {
    vote.votingPower = ZERO_BI;
    vote.updated = event.block.timestamp;
    vote.save();
    if (vote.like) {
      proposal.upVotes = proposal.upVotes.minus(event.params.weight.abs());
    } else {
      proposal.downVotes = proposal.downVotes.minus(event.params.weight.abs());
    }
    proposal.save();
  }
}