// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";

import { Player, PlayerTableId } from "../codegen/tables/Player.sol";
import { Position, PositionData, PositionTableId } from "../codegen/tables/Position.sol";
import { Spawner } from "../codegen/tables/Spawner.sol";
import { MonsterType } from "../codegen/tables/MonsterType.sol";
import { Health } from "../codegen/tables/Health.sol";
import { Room, RoomData } from "../codegen/tables/Room.sol";

import { MonsterTypes } from "../Types.sol";

import { LibMonster } from "../libraries/LibMonster.sol";
import { LibPosition } from "../libraries/LibPosition.sol";
import { LibStamina } from "../libraries/LibStamina.sol";
import { LibRandom } from "../libraries/LibRandom.sol";

import { addressToEntity, getUniqueEntityId } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

contract SpawnerSystem is System {
  function create(int32 roomX, int32 roomY, int32 x, int32 y) public returns (bytes32) {
    require(LibPosition.withinRoomBounds(PositionData(x, y)), "Invalid position");

    bytes32[] memory conflictingPositions = getKeysWithValue(PositionTableId, Position.encode(x, y));
    require(conflictingPositions.length == 0, "Position already occupied");

    bytes32 spawner = LibMonster.spawnSpawner(RoomData(roomX, roomY), PositionData(x, y));
    return spawner;
  }

  function spawn(bytes32 spawnerId, int32 x, int32 y) public returns (bytes32) {
    require(Spawner.get(spawnerId), "Not a spawner");

    LibStamina.spend(spawnerId, 100_000);

    PositionData memory targetPosition = PositionData(x, y);

    bytes32[] memory conflictingPositions = getKeysWithValue(PositionTableId, Position.encode(x, y));
    require(conflictingPositions.length == 0, "Position already occupied");

    PositionData memory spawnerPosition = Position.get(spawnerId);
    require(LibPosition.manhattan(spawnerPosition, targetPosition) == 1, "Invalid position");

    uint256 seed = LibRandom.getSeed(spawnerId) % 2;
    bytes32 monster;

    if(seed == 0) {
      monster = LibMonster.spawnSkeleton(Room.get(spawnerId), targetPosition);
    } else {
      monster = LibMonster.spawnSpider(Room.get(spawnerId), targetPosition);
    }
    
    return monster;
  }
}
