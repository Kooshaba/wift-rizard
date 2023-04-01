// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { PositionData } from "../tables/Position.sol";

library LibPosition {
  function manhattan(PositionData memory a, PositionData memory b) internal pure returns (int32) {
    return abs(a.x - b.x) + abs(a.y - b.y);
  }

  function abs(int32 x) internal pure returns (int32) {
    return x >= 0 ? x : -x;
  }
}
