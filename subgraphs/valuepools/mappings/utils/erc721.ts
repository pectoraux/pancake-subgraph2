/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Va } from "../../generated/VavaHelper/Va";

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = Va.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}