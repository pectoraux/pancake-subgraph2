/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { wills } from "../../generated/wills/wills";

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = wills.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}