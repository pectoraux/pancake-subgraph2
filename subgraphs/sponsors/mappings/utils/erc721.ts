/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { sponsors } from "../../generated/sponsors/sponsors";

export function fetchNoteURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = sponsors.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}