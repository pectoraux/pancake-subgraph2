/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { RampAds } from "../../generated/RampHelper/RampAds";

export function fetchNoteURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = RampAds.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}