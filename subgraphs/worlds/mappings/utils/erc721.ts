/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { worldHelper2 } from "../../generated/worlds/worldHelper2";
import { worldHelper3 } from "../../generated/worlds/worldHelper3";

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = worldHelper2.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}

export function fetchNoteURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = worldHelper3.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}