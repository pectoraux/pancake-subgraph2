/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { arpNote } from "../../generated/arps/arpNote";
import { arpHelper } from "../../generated/arps/arpHelper";

export function fetchNoteURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = arpNote.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = arpHelper.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}