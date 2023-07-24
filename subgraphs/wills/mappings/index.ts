/* eslint-disable prefer-const */
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Protocol, WILL, Token, Note } from "../generated/schema";
import {
  TransferDueToNote,
  CreateWILL,
  UpdateProtocol,
  DeleteProtocol,
  DeleteWILL,
  AddBalance,
  RemoveBalance,
} from "../generated/wills/wills";
import { fetchTokenURI } from "./utils/erc721";

let ZERO_BI = BigInt.fromI32(0);
let WILL_NOTE = "0x86eb24c62635573f0dbc52b1b07660f6b3fa8fda";

export function handleUpdateProtocol(event: UpdateProtocol): void {
  let protocol = Protocol.load(event.params.profileId.toString() + '_' + event.params.will.toHex());
  if (protocol === null) {
    protocol = new Protocol(event.params.profileId.toString() + '_' + event.params.will.toHex());
    protocol.createdAt = event.block.timestamp;
  }
  protocol.active = true;
  protocol.updatedAt = event.block.timestamp;
  protocol.owner = event.params.owner.toHex();
  protocol.will = event.params.will.toHex();
  protocol.profileId = event.params.profileId;
  // protocol.tokens = event.params.tokens;
  protocol.percentages = event.params.percentages;
  protocol.description = event.params.description;
  protocol.media = event.params.media;
  protocol.save();
}

export function handleDeleteProtocol(event: DeleteProtocol): void {
  let protocol = Protocol.load(event.params.protocolId.toString() + '_' + event.params.will.toHex());
  if (protocol !== null) {
    protocol.active = false;
    protocol.save();
  }
}

export function handleCreateWILL(event: CreateWILL): void {
  let will = WILL.load(event.params.will.toHex());
  if (will === null) {
    will = new WILL(event.params.will.toHex());
    will.save();
  }
}

export function handleDeleteWILL(event: DeleteWILL): void {
  let will = WILL.load(event.params.will.toHex());
  if (will !== null) {
    will.active = false;
    will.save();
  }
}

export function handleAddBalance(event: AddBalance): void {
  let will = WILL.load(event.params.will.toHex());
  if (will !== null) {
    let token = Token.load(event.params.will.toHex() + '-' + event.params.token.toHex());
    if (token === null) {
      token = new Token(event.params.will.toHex() + '-' + event.params.token.toHex());
      token.active = true;
      token.value = ZERO_BI;
      token.tokenAddress = event.params.token.toHex();
      token.tokenType = BigInt.fromI32(event.params.tokenType);
      token.will = event.params.will.toHex();
    }
    token.value = token.value.plus(event.params.value);
    token.save();
  }
}

export function handleRemoveBalance(event: RemoveBalance): void {
  let will = WILL.load(event.params.will.toHex());
  if (will !== null) {
    let token = Token.load(event.params.will.toHex() + '-' + event.params.token.toHex());
    if (token !== null) {
      token.active = token.value.equals(event.params.value);
      // if (token.value.gte(event.params.value)) {
        token.value = token.value.minus(event.params.value);
      // }
      token.save();
    }
  }
}

export function handleTransferDueToNote(event: TransferDueToNote): void {
    log.warning("will===============> - #{}", [event.params.will.toHex()]);
    let will = WILL.load(event.params.will.toHex());
  if (will !== null) {
    let uri = fetchTokenURI(Address.fromString(WILL_NOTE), event.params.tokenId);
    log.warning("uri2===============> - #{}", [uri]);
    if (uri !== null) {
      let note = Note.load(event.params.tokenId.toString());
      if (note === null) {
        note = new Note(event.params.tokenId.toString());
        note.createdAt = event.block.timestamp;
      }
      note.will = will.id;
      note.metadataUrl = uri;
      note.save();
    }
  }
}