/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { gameHelper } from "../../generated/GameFactory/gameHelper";

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = gameHelper.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}