/* eslint-disable prefer-const */
import { BigInt, log } from "@graphprotocol/graph-ts";
import { Litigation, Vote } from "../generated/schema";
import {
  Voted,
  GaugeCreated,
  GaugeClosed,
  UpdateAttackerContent,
  UpdateDefenderContent,
} from "../generated/TrustBountyVoter/TrustBountyVoter";
import { toBigDecimal } from "./utils";

// BigNumber-like references
let ZERO_BI = BigInt.fromI32(0);

/**
 * COLLECTION(S)
 */

 export function handleGaugeCreated(event: GaugeCreated): void {
  let litigation = Litigation.load(event.params.litigationId.toString());
  if (litigation === null) {
    litigation = new Litigation(event.params.litigationId.toString());
    litigation.active = true;
    litigation.creationTime = event.params.creationTime
    litigation.market = event.params.market.toHexString()
    litigation.upVotes = ZERO_BI;
    litigation.downVotes = ZERO_BI;
  }
  litigation.attackerId = event.params.attackerId
  litigation.defenderId = event.params.defenderId
  litigation.endTime = event.params.endTime
  litigation.percentile = event.params.percentile
  litigation.title = event.params.title
  litigation.attackerContent = event.params.content
  litigation.ve = event.params.ve.toHexString()
  litigation.token = event.params.token.toHexString()
  litigation.gas = toBigDecimal(event.params.gas, 2)
  litigation.products = event.params.tags;
  log.warning("STOP1===============> - #{}", [event.params.title]);
  log.warning("STOP2===============> - #{}", [event.params.content]);
  log.warning("STOP3===============> - #{}", [event.params.tags]);

  litigation.save();
}

export function handleUpdateAttackerContent(event: UpdateAttackerContent): void {
  let litigation = Litigation.load(event.params.litigationId.toString());
  if (litigation !== null) {
    litigation.attackerContent = event.params.content
    litigation.save();
  }
}

export function handleUpdateDefenderContent(event: UpdateDefenderContent): void {
  let litigation = Litigation.load(event.params.litigationId.toString());
  if (litigation !== null) {
    litigation.defenderContent = event.params.content
    litigation.save();
  }
}

export function handleVoted(event: Voted): void {
  let litigation = Litigation.load(event.params.litigationId.toString());
  if (litigation !== null) {
    let vote = Vote.load(event.params.tokenId.toString());
    if (vote === null) {
      vote = new Vote(event.params.tokenId.toString());
      if (event.params.weight.gt(ZERO_BI)) {
        vote.choice = "Attacker";
      } else {
        vote.choice = "Defender";
      }
      vote.litigation = litigation.id;
      vote.created = event.block.timestamp;
      vote.votingPower = event.params.weight.abs();
      vote.voter = event.params.voter.toHexString();
      vote.save();
    } else {
      if (event.params.weight.gt(ZERO_BI)) {
        vote.choice = "Attacker";
      } else {
        vote.choice = "Defender";
      }
      vote.created = event.block.timestamp;
      vote.votingPower = event.params.weight.abs();
      vote.voter = event.params.voter.toHexString();
      vote.save();
    }
    if (event.params.weight.gt(ZERO_BI)) {
      litigation.upVotes = litigation.upVotes.plus(event.params.weight.abs())
    } else {
      litigation.downVotes = litigation.downVotes.plus(event.params.weight.abs())
    }
    litigation.save();
  }
}

export function handleGaugeClosed(event: GaugeClosed): void {
  let litigation = Litigation.load(event.params.litigationId.toString());
  if (litigation !== null) {
    litigation.active = false;
    litigation.save();
  }
}