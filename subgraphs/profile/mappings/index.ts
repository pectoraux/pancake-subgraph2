/* eslint-disable prefer-const */
import { BigDecimal, BigInt, Address, log } from "@graphprotocol/graph-ts";
import { Profile, Token, Registration, Blacklist, Account } from "../generated/schema";
import {
  CreateProfile,
  PayProfile,
  ClaimRevenue,
  Follow,
  Unfollow,
  UpdateSSID,
  UpdateBlackList,
  AddAccount,
  RemoveAccount,
  DeleteProfile,
  AddBounty,
  UpdateCollectionId,
  UpdateMiscellaneous,
} from "../generated/Profile/Profile";
import { toBigDecimal } from "./utils";
import { fetchTokenURI } from "./utils/erc721";

// BigNumber-like references
let ZERO_BD = BigDecimal.fromString("0");
let ONE_BI = BigInt.fromI32(1);
let PROFILE_HELPER = "0xf2ca8333888cf3c673e81225228a000f9b7b4338"

/**
 * TEAM
 */

export function handleCreateProfile(event: CreateProfile): void {
  // Fail safe condition in case the team has already been created.
  let profile = Profile.load(event.params.profileId.toString());
  if (profile === null) {
    profile = new Profile(event.params.profileId.toString());
    profile.name = event.params.name;
    profile.active = true;
    profile.timestamp = event.block.timestamp;
    let uri = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.profileId);
    profile.metadataUrl = uri;
    log.warning("uri===============> - #{}", [uri]);
    profile.save();
  }
}


export function handleAddAccount(event: AddAccount): void {
  let profile = Profile.load(event.params.profileId.toString());
  if (profile !== null) {
    let account = Account.load(event.params.profileId.toString() + '-' + event.params.account.toHexString());
    if (account === null) {
      account = new Account(event.params.profileId.toString() + '-' + event.params.account.toHexString());
      account.active = true;
      account.createdAt = event.block.timestamp;
      account.profile = event.params.profileId.toString();
      account.ownerAddress = event.params.account.toHexString();
      account.save();
    }
    let uri = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.profileId);
    if (uri !== null) {
      profile.metadataUrl = uri;
    }
    profile.save();
  }
}

export function handlePayProfile(event: PayProfile): void {
  let profile = Profile.load(event.params.profileId.toString());
  if (profile !== null) {
    let token = Token.load(event.params.profileId.toString() + '-' + event.params.token.toHexString());
    if (token === null) {
      token = new Token(event.params.profileId.toString() + '-' + event.params.token.toHexString());
      token.profile = event.params.profileId.toString();
      token.tokenAddress = event.params.token.toHexString();
      token.createdAt = event.block.timestamp;
      token.amount = ZERO_BD;
    }
    token.updatedAt = event.block.timestamp;
    token.amount = token.amount.plus(toBigDecimal(event.params.amount, 0));
    token.save();
    let uri = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.profileId);
    if (uri !== null) {
      profile.metadataUrl = uri;
    }
    profile.save();
  }
}

export function handleClaimRevenue(event: ClaimRevenue): void {
  let profile = Profile.load(event.params.profileId.toString());
  if (profile !== null) {
    let token = Token.load(event.params.profileId.toString() + '-' + event.params.token.toHexString());
    if (token !== null) {
      token.updatedAt = event.block.timestamp;
      token.amount = token.amount.minus(toBigDecimal(event.params.amount, 0));
      token.save();
    }
    let uri = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.profileId);
    if (uri !== null) {
      profile.metadataUrl = uri;
    }
    profile.save();
  }
}

export function handleFollow(event: Follow): void {
  let followeeProfileId = Profile.load(event.params.followeeProfileId.toString());
  let followerProfileId = Profile.load(event.params.followerProfileId.toString());
  if (followeeProfileId !== null && followerProfileId !== null) {
    let registration = Registration.load(event.params.followeeProfileId.toString() + '-' + event.params.followerProfileId.toString());
    if (registration === null) {
      registration = new Registration(event.params.followeeProfileId.toString() + '-' + event.params.followerProfileId.toString());
      registration.createdAt = event.block.timestamp;
      registration.active = true;
      registration.follower = event.params.followerProfileId.toString();
      registration.followee = event.params.followeeProfileId.toString();
      registration.save();
    }
    followeeProfileId.metadataUrl = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.followeeProfileId);
    followerProfileId.metadataUrl = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.followerProfileId);
    followeeProfileId.save();
    followerProfileId.save();
  }
}

export function handleUnfollow(event: Unfollow): void {
  let followeeProfileId = Profile.load(event.params.followeeProfileId.toString());
  let followerProfileId = Profile.load(event.params.followerProfileId.toString());
  if (followeeProfileId !== null && followerProfileId !== null) {
    let registration = Registration.load(event.params.followeeProfileId.toHexString() + '-' + event.params.followerProfileId.toHexString());
    if (registration !== null) {
      registration.updatedAt = event.block.timestamp;
      registration.active = false;
      registration.follower = null;
      registration.followee = null;
      registration.save();
    }
    followeeProfileId.metadataUrl = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.followeeProfileId);
    followerProfileId.metadataUrl = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.followerProfileId);
    followeeProfileId.save();
    followerProfileId.save();
  }
}

export function handleUpdateBlackList(event: UpdateBlackList): void {
  let ownerProfileId = Profile.load(event.params.ownerProfileId.toString());
  let userProfileId = Profile.load(event.params.userProfileId.toString());
  if (ownerProfileId !== null && userProfileId !== null) {
    let blacklist = Blacklist.load(event.params.ownerProfileId.toHexString() + '-' + event.params.userProfileId.toHexString());
    if (blacklist === null) {
      blacklist = new Blacklist(event.params.ownerProfileId.toHexString() + '-' + event.params.userProfileId.toHexString());
      blacklist.active = event.params.add;
      blacklist.createdAt = event.block.timestamp;
      blacklist.owner = event.params.ownerProfileId.toHexString();
      blacklist.user = event.params.userProfileId.toHexString();
      blacklist.save();
    } else {
      blacklist.active = event.params.add;
      blacklist.updatedAt = event.block.timestamp;
      if (!event.params.add) {
        blacklist.owner = null;
        blacklist.user = null;
      }
      blacklist.save();
    }
    ownerProfileId.metadataUrl = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.ownerProfileId);
    ownerProfileId.save();
    userProfileId.metadataUrl = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.userProfileId);
    userProfileId.save();
  }
}


export function handleRemoveAccount(event: RemoveAccount): void {
  let profile = Profile.load(event.params.profileId.toString());
  if (profile !== null) {
    let account = Account.load(event.params.profileId.toString() + '-' + event.params.account.toHexString());
    if (account !== null) {
      account.active = false;
      account.updatedAt = event.block.timestamp;
      account.profile = '';
      account.save();
    }
    let uri = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.profileId);
    if (uri !== null) {
      profile.metadataUrl = uri;
    }
    profile.save();
  }
}

export function handleDeleteProfile(event: DeleteProfile): void {
  let profile = Profile.load(event.params.profileId.toString());
  if (profile !== null) {
    profile.active = false;
    profile.name = '';
    let uri = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.profileId);
    if (uri !== null) {
      profile.metadataUrl = uri;
    }
    profile.save();
  }
}

export function handleAddBounty(event: AddBounty): void {
  let profile = Profile.load(event.params.profileId.toString());
  if (profile !== null) {
    let token = Token.load(event.params.profileId.toString() + '-' + event.params.token.toHexString());
    if (token !== null) {
      token.updatedAt = event.block.timestamp;
      token.bountyId = event.params.bountyId;
      token.save();
    }
  }
}

export function handleUpdateCollectionId(event: UpdateCollectionId): void {
  let profile = Profile.load(event.params.profileId.toString());
  if (profile !== null) {
    profile.collectionId = event.params.collectionId;
    let uri = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.profileId);
    if (uri !== null) {
      profile.metadataUrl = uri;
    }
    profile.save();
  }
}

export function handleUpdateMiscellaneous(event: UpdateMiscellaneous): void {
  // if (event.params.idx.equals(ONE_BI)) {
    let profile = Profile.load(event.params.collectionId.toString());
    if (profile != null) {
      let uri = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.collectionId);
      if (uri !== null) {
        profile.metadataUrl = uri;
      }
      log.warning("uri2===============> -{} #{}", [event.params.collectionId.toString(), uri]);
      profile.save();
    }
  // }
}

export function handleUpdateSSID(event: UpdateSSID): void {
  let profile = Profile.load(event.params.profileId.toString());
  if (profile != null) {
    let uri = fetchTokenURI(Address.fromString(PROFILE_HELPER), event.params.profileId);
    if (uri !== null) {
      profile.metadataUrl = uri;
    }
    log.warning("uri3===============> - #{}", [uri]);
    profile.save();
  }
}