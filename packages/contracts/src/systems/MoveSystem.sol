// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { Player, PlayerTableId } from "../tables/Player.sol";
import { Room, RoomData } from "../tables/Room.sol";
import { Position, PositionData, PositionTableId } from "../tables/Position.sol";
import { World } from "@latticexyz/world/src/World.sol";

import { LibMonster } from "../libraries/LibMonster.sol";
import { LibPosition } from "../libraries/LibPosition.sol";
import { LibStamina } from "../libraries/LibStamina.sol";

import { addressToEntity } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

contract MoveSystem is System {
  function move(int32 x, int32 y) public {
    require(LibPosition.withinRoomBounds(PositionData(x, y)), "Invalid position");

    bytes32 player = addressToEntity(_msgSender());
    LibStamina.spend(player, 25_000);

    uint32 existingId = Player.get(player);
    require(existingId != 0, "Must spawn first");

    bytes32[] memory conflictingPositions = getKeysWithValue(PositionTableId, Position.encode(x, y));
    require(conflictingPositions.length == 0, "Position already occupied");

    PositionData memory oldCoord = Position.get(player);
    require(LibPosition.manhattan(oldCoord, PositionData(x, y)) == 1, "Must move one tile");

    Position.set(player, x, y);
  }

  function moveRoom(int32 x, int32 y) public {
    bytes32 player = addressToEntity(_msgSender());
    LibStamina.spend(player, 100_000);

    uint32 existingId = Player.get(player);
    require(existingId != 0, "Must spawn first");

    RoomData memory oldRoom = Room.get(player);
    require(
      LibPosition.manhattan(PositionData(oldRoom.x, oldRoom.y), PositionData(x, y)) == 1,
      "Must move one tile"
    );

    Room.set(player, x, y);
  }
}
