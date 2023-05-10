// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { PositionData } from "../codegen/tables/Position.sol";

int32 constant ROOM_WIDTH = 12;
int32 constant ROOM_HEIGHT = 6;

enum Direction {
  Up,
  Right,
  Down,
  Left
}

library LibPosition {
  function manhattan(PositionData memory a, PositionData memory b) internal pure returns (int32) {
    return abs(a.x - b.x) + abs(a.y - b.y);
  }

  function chebyshev(PositionData memory a, PositionData memory b) internal pure returns (int32) {
    return max(abs(a.x - b.x), abs(a.y - b.y));
  }

  function max(int32 a, int32 b) internal pure returns (int32) {
    return a >= b ? a : b;
  }

  function abs(int32 x) internal pure returns (int32) {
    return x >= 0 ? x : -x;
  }

  function withinRoomBounds(PositionData memory position) internal pure returns (bool) {
    return position.x >= 0 && position.x < ROOM_WIDTH && position.y >= 0 && position.y < ROOM_HEIGHT;
  }

  function getDirection(PositionData memory coord1, PositionData memory coord2) internal pure returns (Direction) {
    int256 deltaX = coord2.x - coord1.x;
    int256 deltaY = coord2.y - coord1.y;

    if (deltaX == 0 && deltaY > 0) {
      return Direction.Up;
    } else if (deltaX > 0 && deltaY == 0) {
      return Direction.Right;
    } else if (deltaX == 0 && deltaY < 0) {
      return Direction.Down;
    } else if (deltaX < 0 && deltaY == 0) {
      return Direction.Left;
    } else {
      revert("Invalid coordinates. The points must be either horizontally or vertically aligned.");
    }
  }
}
