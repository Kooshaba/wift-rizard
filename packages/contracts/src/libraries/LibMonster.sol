// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { MonsterTypes } from "../Types.sol";
import { getUniqueEntityId } from "../Utils.sol";

import { MonsterType } from "../tables/MonsterType.sol";
import { Position, PositionData, PositionTableId } from "../tables/Position.sol";
import { Health } from "../tables/Health.sol";
import { MoveSpeed } from "../tables/MoveSpeed.sol";
import { Stamina, StaminaData } from "../tables/Stamina.sol";
import { Attack, AttackData } from "../tables/Attack.sol";
import { Room, RoomData } from "../tables/Room.sol";
import { Spawner } from "../tables/Spawner.sol";
import { RngCommit } from "../tables/RngCommit.sol";

import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

library LibMonster {
  // function randomlySpawnMonster(bytes32 seed, int32 originX, int32 originY) internal {
  //   bytes32 randomSeed = blockhash(block.number - 1);
  //   uint256 random = uint256(keccak256(abi.encodePacked(randomSeed, seed, block.timestamp)));
  //   if (random % 4 == 0) {
  //     uint256 offsetSeed = uint256(keccak256(abi.encodePacked(randomSeed, seed, block.timestamp, random)));
  //     uint256 offsetSeed2 = uint256(keccak256(abi.encodePacked(randomSeed, seed, block.timestamp, random, offsetSeed)));
  //     int32 xOffset = int32(uint32(offsetSeed % 6)) - 3;
  //     int32 yOffset = int32(uint32(offsetSeed2 % 6)) - 3;

  //     PositionData memory spawnCoord = PositionData(originX + xOffset, originY + yOffset);
  //     bytes32[] memory blockingSpawn = getKeysWithValue(PositionTableId, Position.encode(spawnCoord.x, spawnCoord.y));

  //     bool invalidPosition = (spawnCoord.x == originX && spawnCoord.y == originY) || blockingSpawn.length > 0;
  //     if (!invalidPosition) {
  //       LibMonster.spawnSkeleton(originX + xOffset, originY + yOffset);
  //     }
  //   }
  // }

  function spawnSpawner(RoomData memory room, PositionData memory position) internal returns (bytes32) {
    bytes32 id = getUniqueEntityId();

    MonsterType.set(id, uint32(MonsterTypes.Spawner));
    Spawner.set(id, true);
    Room.set(id, room);
    Position.set(id, position);
    Health.set(id, 100, 100);
    Stamina.set(id, StaminaData({ current: 100_000, max: 100_000, regen: 10_000, lastRefreshedAt: block.timestamp }));

    return id;
  }

  function spawnSkeleton(RoomData memory room, PositionData memory position) internal returns (bytes32) {
    bytes32 id = getUniqueEntityId();

    MonsterType.set(id, uint32(MonsterTypes.Skeleton));
    Room.set(id, room);
    Position.set(id, position);
    Health.set(id, 20, 20);
    MoveSpeed.set(id, 2);
    Stamina.set(id, StaminaData({ current: 0, max: 25_000, regen: 2_000, lastRefreshedAt: block.timestamp }));
    RngCommit.set(id, block.number - 1);

    Attack.set(
      id,
      AttackData({
        strength: 10,
        staminaCost: 25_000,
        minRange: 1,
        maxRange: 1,
        patternX: new int32[](1),
        patternY: new int32[](1)
      })
    );

    return id;
  }
}
