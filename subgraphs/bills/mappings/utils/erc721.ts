/* eslint-disable prefer-const */
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { billNote } from "../../generated/bills/billNote";
import { billMinter } from "../../generated/bills/billMinter";

export function fetchNoteURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = billNote.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}

export function fetchTokenURI(collectionAddress: Address, tokenId: BigInt): string | null {
  let contract = billMinter.bind(collectionAddress);

  let tokenURIResult = contract.try_tokenURI(tokenId);
  if (!tokenURIResult.reverted) {
    return tokenURIResult.value;
  }

  return null;
}