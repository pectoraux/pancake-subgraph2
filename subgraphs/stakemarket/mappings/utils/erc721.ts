/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { StakeMarketHelper } from "../../generated/StakeMarket/StakeMarketHelper";

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = StakeMarketHelper.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}