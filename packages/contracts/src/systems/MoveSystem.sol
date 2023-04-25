// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { Player, PlayerTableId } from "../tables/Player.sol";
import { Room, RoomData } from "../tables/Room.sol";
import { Position, PositionData, PositionTableId } from "../tables/Position.sol";
import { MoveSpeed } from "../tables/MoveSpeed.sol";
import { BonusAttributes } from "../tables/BonusAttributes.sol";

import { World } from "@latticexyz/world/src/World.sol";

import { LibMonster } from "../libraries/LibMonster.sol";
import { LibPosition } from "../libraries/LibPosition.sol";
import { LibStamina } from "../libraries/LibStamina.sol";

import { addressToEntity } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

contract MoveSystem is System {
  function move(int32[] memory xPath, int32[] memory yPath) public {
    bytes32 player = addressToEntity(_msgSender());
    LibStamina.spend(player, 25_000);

    int32 remainingMoveSpeed = MoveSpeed.get(player) + BonusAttributes.getMoveSpeed(player);
    PositionData memory origin = Position.get(player);

    uint32 existingId = Player.get(player);
    require(existingId != 0, "Must spawn first");

    for (uint i = 0; i < xPath.length; i++) {
      require(remainingMoveSpeed > 0, "Not enough move speed");

      PositionData memory coord = PositionData(xPath[i], yPath[i]);
      require(LibPosition.withinRoomBounds(coord), "Invalid position");

      bytes32[] memory blockingEntities = getKeysWithValue(PositionTableId, Position.encode(coord.x, coord.y));
      require(blockingEntities.length == 0, "Position already occupied");

      require(LibPosition.manhattan(origin, coord) == 1, "Invalid path");

      origin = coord;
      remainingMoveSpeed--;
    }

    PositionData memory finalDestination = PositionData(xPath[xPath.length - 1], yPath[yPath.length - 1]);
    Position.set(player, finalDestination.x, finalDestination.y);
  }

  function moveRoom(int32 x, int32 y) public {
    bytes32 player = addressToEntity(_msgSender());
    LibStamina.spend(player, 100_000);

    uint32 existingId = Player.get(player);
    require(existingId != 0, "Must spawn first");

    RoomData memory oldRoom = Room.get(player);
    require(LibPosition.manhattan(PositionData(oldRoom.x, oldRoom.y), PositionData(x, y)) == 1, "Must move one tile");

    Room.set(player, x, y);
  }
}
