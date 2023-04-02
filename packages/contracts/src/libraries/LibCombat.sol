// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { PositionData } from "../tables/Position.sol";
import { Direction } from "./LibPosition.sol";

library LibCombat {
  function rotateAttackPattern(
    PositionData[] memory pattern,
    Direction direction
  ) internal pure returns (PositionData[] memory) {
    uint256 patternLength = pattern.length;
    PositionData[] memory rotatedPattern = new PositionData[](patternLength);

    if(direction == Direction.Up) {
      return pattern;
    }

    for (uint256 i = 0; i < patternLength; i++) {
      int32 x = pattern[i].x;
      int32 y = pattern[i].y;

      if (direction == Direction.Right) {
        rotatedPattern[i] = PositionData(y, x);
      } else if (direction == Direction.Down) {
        rotatedPattern[i] = PositionData(-x, -y);
      } else if (direction == Direction.Left) {
        rotatedPattern[i] = PositionData(-y, -x);
      }
    }

    return rotatedPattern;
  }
}