/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { auditorHelper } from "../../generated/auditors/auditorHelper";
import { auditors } from "../../generated/auditors/auditors";

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = auditorHelper.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}

export function fetchNoteURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = auditors.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}