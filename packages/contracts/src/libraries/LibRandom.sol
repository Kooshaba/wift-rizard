// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { RngCommit } from "../tables/RngCommit.sol";

library LibRandom {
  function getSeed(bytes32 entity) internal returns(uint256) {
    uint256 commitBlock = RngCommit.get(entity);
    uint256 randomSeed = uint256(blockhash(commitBlock));
    RngCommit.set(entity, block.number);

    return randomSeed;
  }
}
