/* eslint-disable prefer-const */
import { BigDecimal, BigInt, Address, log } from "@graphprotocol/graph-ts";
import { UserData, Profile, IdentityToken } from "../generated/schema";
import {
  DataCreated,
  CreateAccount,
  DataDeleted,
  GenerateShareProof,
  GenerateIdentityProof,
} from "../generated/SSI/SSI";
import { fetchTokenURI } from "./utils/erc721";

let SSI = "0x1de9D006f209E9A7556270cae74D1F0D6864168a"

export function handleCreateAccount(event: CreateAccount): void {
  let profile = Profile.load(event.params.profileId.toString());
  if (profile === null) {
    profile = new Profile(event.params.profileId.toString());
  }
  profile.owner = event.params.owner.toHexString();
  profile.publicKey = event.params.publicKey;
  profile.encyptedPrivateKey = event.params.encyptedPrivateKey;
  profile.save();
}

export function handleDataDeleted(event: DataDeleted): void {
  let qestionId = event.params.question.split(' ').join('_')
  let profile = Profile.load(event.params.profileId.toString());
  if (profile !== null) {
    let userData = UserData.load(event.params.profileId.toString() + '_' + qestionId + '_' + profile.owner);
    if (userData !== null) {
      userData.owner = "";
      userData.auditor = "";
      userData.question = "";
      userData.answer = "";
      userData.ownerProfileId = "0";
      userData.auditorProfileId = "0";
      userData.save();
    }
  }
}

export function handleDataCreated(event: DataCreated): void {
  let qestionId = event.params.question.split(' ').join('_')
  let userData = UserData.load(event.params.profileId.toString() + '_' + qestionId + '_' + event.params.owner.toHexString());
  if (userData === null) {
    userData = new UserData(event.params.profileId.toString() + '_' + qestionId + '_' + event.params.owner.toHexString());
    userData.owner = event.params.owner.toHexString();
    userData.auditor = event.params.auditor.toHexString();
    userData.question = event.params.question;
    userData.answer = event.params.answer;
    userData.dataType = event.params.dataType;
    userData.searchable = event.params.searchable;
    userData.startTime = event.params.startTime;
    userData.endTime = event.params.endTime;
    userData.auditorProfileId = event.params.auditorProfileId.toString();
    userData.ownerProfileId = event.params.profileId.toString();
    userData.save();
  } else {
    userData.owner = event.params.owner.toHexString();
    userData.auditor = event.params.auditor.toHexString();
    userData.question = event.params.question;
    userData.answer = event.params.answer;
    userData.dataType = event.params.dataType;
    userData.searchable = event.params.searchable;
    userData.startTime = event.params.startTime;
    userData.endTime = event.params.endTime;
    userData.auditorProfileId = event.params.auditorProfileId.toString();
    userData.ownerProfileId = event.params.profileId.toString();
    userData.save();
  }
}

export function handleGenerateShareProof(event: GenerateShareProof): void {
  let uri = fetchTokenURI(Address.fromString(SSI), event.params.tokenId);
  let identityToken = IdentityToken.load(event.params.tokenId.toString());
  if (identityToken === null) {
    identityToken = new IdentityToken(event.params.tokenId.toString());
    identityToken.profile = event.params.senderProfileId.toString();
    identityToken.auditor = event.params.auditorProfileId.toString();
    identityToken.receiver = event.params.receiverProfileId.toString();
  }
  identityToken.owner = event.params.owner.toHexString();
  if (uri !== null) {
    identityToken.metadataUrl = uri;
    log.warning("uri===============> - #{}", [uri]);
  }
  identityToken.save();
}

export function handleGenerateIdentityProof(event: GenerateIdentityProof): void {
  let uri = fetchTokenURI(Address.fromString(SSI), event.params.tokenId);
  let identityToken = IdentityToken.load(event.params.tokenId.toString());
  if (identityToken === null) {
    identityToken = new IdentityToken(event.params.tokenId.toString());
    identityToken.profile = event.params.senderProfileId.toString();
    identityToken.auditor = event.params.auditorProfileId.toString();
  }
  identityToken.owner = event.params.owner.toHexString();
  if (uri !== null) {
    identityToken.metadataUrl = uri;
    log.warning("uri===============> - #{}", [uri]);
  }
  identityToken.save();
}