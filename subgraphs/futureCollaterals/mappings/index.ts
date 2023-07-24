/* eslint-disable prefer-const */
import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { Collateral } from "../generated/schema";
import {
  Mint,
} from "../generated/collaterals/collaterals";
import { toBigDecimal } from "./utils";
import { fetchTokenURI } from "./utils/erc721";

let ZERO_BI = BigInt.fromString("0");
let FUTURE_COLLATERAL = "0xd2b2435aa749e42f3523033fe167ae543082375f"

export function handleMint(event: Mint): void {
  let collateral = Collateral.load(event.params._tokenId.toString());
  if (collateral === null) {
    collateral = new Collateral(event.params._tokenId.toString());
    collateral.active = true;
    collateral.createdAt = event.block.timestamp;
  }
  collateral.updatedAt = event.block.timestamp;
  collateral.owner = event.params._to.toHexString();
  collateral.auditor = event.params._auditor.toHexString();
  collateral.channel = event.params._channel;
  collateral.stakeId = event.params._stakeId;
  collateral.bountyId = event.params._userBountyId;
  collateral.auditorBountyId = event.params._auditorBountyId;

  let uri = fetchTokenURI(Address.fromString(FUTURE_COLLATERAL), event.params._tokenId);
  collateral.metadataUrl = uri;

  collateral.save();
}