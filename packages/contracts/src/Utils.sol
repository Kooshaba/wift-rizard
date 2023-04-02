// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Nonce } from "./tables/Nonce.sol";

function addressToEntity(address a) pure returns (bytes32) {
  return bytes32(uint256(uint160((a))));
}

bytes32 constant SingletonKey = bytes32(uint256(0x060D));

function getUniqueEntityId() returns (bytes32) {
  uint256 nonce = Nonce.get(SingletonKey);
  bytes32 id = bytes32(keccak256(abi.encodePacked(block.timestamp, block.difficulty, nonce, msg.sender)));

  Nonce.set(SingletonKey, nonce + 1);

  return id;
}