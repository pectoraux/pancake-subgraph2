/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { NFTicketHelper2 } from "../../generated/MarketPlace/NFTicketHelper2";

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = NFTicketHelper2.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}