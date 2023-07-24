/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ProfileHelper } from "../../generated/Profile/ProfileHelper";

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = ProfileHelper.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}