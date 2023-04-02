// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Position, PositionData } from "../tables/Position.sol";
import { ROOM_SIZE } from "./LibPosition.sol";

library PositionQueue {
  struct Queue {
    PositionData[] elements;
    uint256 front;
    uint256 back;
  }

  function create() internal pure returns (Queue memory) {
    PositionData[] memory elements = new PositionData[](81);
    return Queue(elements, 0, 0);
  }

  function isEmpty(Queue memory self) internal pure returns (bool) {
    return self.back == self.front;
  }

  function isFull(Queue memory self) internal pure returns (bool) {
    return (self.back + 1) % 81 == self.front;
  }

  function enqueue(Queue memory self, PositionData memory element) internal pure {
    require(!isFull(self), "Queue is full");

    self.elements[self.back] = element;
    self.back = (self.back + 1) % 81;
  }

  function dequeue(Queue memory self) internal pure returns (PositionData memory) {
    require(!isEmpty(self), "Queue is empty");

    PositionData memory element = self.elements[self.front];
    self.front = (self.front + 1) % 81;

    return element;
  }
}
