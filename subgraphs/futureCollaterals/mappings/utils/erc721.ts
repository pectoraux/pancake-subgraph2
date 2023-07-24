/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { collaterals } from "../../generated/collaterals/collaterals";

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = collaterals.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}