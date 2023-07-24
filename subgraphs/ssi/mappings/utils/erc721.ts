/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { SSI } from "../../generated/SSI/SSI";

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = SSI.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}