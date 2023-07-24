/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { bettingMinter } from "../../generated/betting/bettingMinter";

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = bettingMinter.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}