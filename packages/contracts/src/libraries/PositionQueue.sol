// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Position, PositionData } from "../tables/Position.sol";
import { ROOM_WIDTH, ROOM_HEIGHT } from "../libraries/LibPosition.sol";

uint256 constant MAX_QUEUE_SIZE = uint256(uint32(ROOM_WIDTH * ROOM_HEIGHT));

library PositionQueue {
  struct Element {
    PositionData position;
    int32 distanceToTarget;
    int32 distanceFromStart;
  }

  struct Queue {
    Element[] elements;
    uint256 front;
    uint256 back;
  }

  function create() internal pure returns (Queue memory) {
    Element[] memory elements = new Element[](MAX_QUEUE_SIZE);
    return Queue(elements, 0, 0);
  }

  function isEmpty(Queue memory self) internal pure returns (bool) {
    return self.back == self.front;
  }

  function isFull(Queue memory self) internal pure returns (bool) {
    return (self.back + 1) % 81 == self.front;
  }

  function enqueue(Queue memory self, Element memory element) internal pure {
    require(!isFull(self), "Queue is full");

    self.elements[self.back] = element;
    self.back = (self.back + 1) % MAX_QUEUE_SIZE;
  }

  function dequeue(Queue memory self) internal pure returns (Element memory) {
    require(!isEmpty(self), "Queue is empty");

    Element memory element = self.elements[self.front];
    self.front = (self.front + 1) % MAX_QUEUE_SIZE;

    return element;
  }
}
