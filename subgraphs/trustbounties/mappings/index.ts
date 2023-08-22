/* eslint-disable prefer-const */
import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Bounty, Balance, Claim, Approval, Tag } from "../generated/schema";
import {
  CreateBounty,
  UpdateBounty,
  DeleteBounty,
  AddBalance,
  DeleteBalance,
  CreateClaim,
  UpdateClaim,
  AddApproval,
  RemoveApproval,
  UpdateMiscellaneous,
} from "../generated/TrustBounties/TrustBounties";
import { toBigDecimal } from "./utils";

let ZERO_BD = BigDecimal.fromString("0");
let ZERO_BI = BigInt.fromI32(0);

export function handleCreateBounty(event: CreateBounty): void {
  let bounty = Bounty.load(event.params.bountyId.toString());
  if (bounty === null) {
    bounty = new Bounty(event.params.bountyId.toString());
  }
  bounty.parentBounty = event.params.parentBountyId.toString();
  bounty.collectionId = event.params.collectionId.toString();
  bounty.bountySource = event.params.bountySource;
  bounty.avatar = event.params.avatar;
  bounty.owner = event.params.owner.toHexString();
  bounty.token = event.params.token.toHexString();
  bounty.timestamp = event.block.timestamp;
  bounty.active = true;
  bounty.save();
}

export function handleUpdateBounty(event: UpdateBounty): void {
  let bounty = Bounty.load(event.params.bountyId.toString());
  if (bounty !== null) {
    bounty.collectionId = event.params.collectionId.toString();
    bounty.owner = event.params.newOwner.toHexString();
    bounty.avatar = event.params.avatar;
    if (bounty.terms === null) {
      bounty.terms = event.params.terms;
    }
    bounty.save();
  }
}

export function handleDeleteBounty(event: DeleteBounty): void {
  let bounty = Bounty.load(event.params.bountyId.toString());
  if (bounty !== null) {
    bounty.active = false;
  }
}

export function handleAddBalance(event: AddBalance): void {
  let balance = Balance.load(event.params.bountyId.toString() + '-' + event.params.source.toHexString());
  if (balance === null) {
    balance = new Balance(event.params.bountyId.toString() + '-' + event.params.source.toHexString());
    balance.source = event.params.source.toHexString();
    balance.bounty = event.params.bountyId.toString();
    balance.amount = toBigDecimal(event.params.balanceAmount, 18);
    balance.timestamp = event.block.timestamp;
    balance.save();
  }
  if (balance.amount !== null) {
    balance.amount = balance.amount.plus(toBigDecimal(event.params.balanceAmount, 18));
  }
  balance.save();
}

export function handleDeleteBalance(event: DeleteBalance): void {
  let balance = Balance.load(event.params.bountyId.toString() + '-' + event.params.source.toHexString());
  if (balance !== null) {
    balance.amount = ZERO_BD;
    balance.save();
  }
}

export function handleCreateClaim(event: CreateClaim): void {
  let claim = Claim.load(event.params.claimId.toString());
  if (claim === null) {
    claim = new Claim(event.params.claimId.toString());
    claim.bounty = event.params.bountyId.toString();
    claim.hunter = event.params.hunter.toHexString();
    claim.amount = toBigDecimal(event.params.amount, 18);
    claim.friendly = event.params.friendly;
    claim.atPeace = event.params.atPeace;
    claim.save();
  }
  claim.bounty = event.params.bountyId.toString();
  claim.hunter = event.params.hunter.toHexString();
  claim.amount = toBigDecimal(event.params.amount, 18);
  claim.friendly = event.params.friendly;
  claim.atPeace = event.params.atPeace;
  claim.save();
}

export function handleUpdateClaim(event: UpdateClaim): void {
  let claim = Claim.load(event.params.claimId.toString());
  if (claim !== null) {
    claim.winner = event.params.winner.toHexString();
    claim.endTime = event.params.endTime;
    claim.atPeace = event.params.atPeace;
    claim.save();
  }
}

export function handleAddApproval(event: AddApproval): void {
  let approval = Approval.load(event.params.bountyId.toString() + '-' + event.params.partnerBounty.toString());
  if (approval === null) {
    approval = new Approval(event.params.bountyId.toString() + '-' + event.params.partnerBounty.toString());
    approval.bounty = event.params.bountyId.toString();
    approval.partnerBounty = event.params.partnerBounty.toString();
    approval.amount = toBigDecimal(event.params.amount, 18);
    approval.timestamp = event.block.timestamp;
    approval.endTime = event.params.endTime;
    approval.save();
  }
  approval.amount = toBigDecimal(event.params.amount, 18);
  approval.endTime = event.params.endTime;
  approval.save();
}

export function handleRemoveApproval(event: RemoveApproval): void {
  let approval = Approval.load(event.params.bountyId.toString() + '-' + event.params.partnerBounty.toString());
  if (approval !== null) {
    if (approval.amount !== null) {
        approval.amount = approval.amount.minus(toBigDecimal(event.params.amount, 18));
    } else {
      approval.amount = toBigDecimal(event.params.amount, 18);
    }
    approval.active = !event.params.deactivate;
    approval.save();
  }
}

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {
  if (event.params.idx.equals(ZERO_BI)) {
    let bounty = Bounty.load(event.params.collectionId.toString());
    if (bounty !== null) {
      if (event.params.sender.equals(Address.fromString(bounty.owner))) {
        bounty.countries = event.params.paramName;
        bounty.cities = event.params.paramValue;
        bounty.products = event.params.paramValue5;
        bounty.save();
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