// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";

import { Player, PlayerTableId } from "../tables/Player.sol";
import { Position, PositionData, PositionTableId } from "../tables/Position.sol";
import { Spawner } from "../tables/Spawner.sol";
import { MonsterType } from "../tables/MonsterType.sol";
import { Health } from "../tables/Health.sol";
import { Room, RoomData } from "../tables/Room.sol";

import { MonsterTypes } from "../Types.sol";

import { LibMonster } from "../libraries/LibMonster.sol";
import { LibPosition } from "../libraries/LibPosition.sol";
import { LibStamina } from "../libraries/LibStamina.sol";

import { addressToEntity, getUniqueEntityId } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

contract SpawnerSystem is System {
  function create(int32 roomX, int32 roomY, int32 x, int32 y) public {
    require(LibPosition.withinRoomBounds(PositionData(x, y)), "Invalid position");

    bytes32[] memory conflictingPositions = getKeysWithValue(PositionTableId, Position.encode(x, y));
    require(conflictingPositions.length == 0, "Position already occupied");

    LibMonster.spawnSpawner(RoomData(roomX, roomY), PositionData(x, y));
  }

  function spawn(bytes32 spawnerId, int32 x, int32 y) public {
    require(Spawner.get(spawnerId), "Not a spawner");

    LibStamina.spend(spawnerId, 100_000);

    PositionData memory targetPosition = PositionData(x, y);

    bytes32[] memory conflictingPositions = getKeysWithValue(PositionTableId, Position.encode(x, y));
    require(conflictingPositions.length == 0, "Position already occupied");

    PositionData memory spawnerPosition = Position.get(spawnerId);
    require(LibPosition.manhattan(spawnerPosition, targetPosition) == 1, "Invalid position");

    LibMonster.spawnSkeleton(Room.get(spawnerId), targetPosition);
  }
}
