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
  function spawnSpawner(RoomData memory room, PositionData memory position) internal returns (bytes32) {
    bytes32 id = getUniqueEntityId();

    MonsterType.set(id, uint32(MonsterTypes.Spawner));
    Spawner.set(id, true);
    Room.set(id, room);
    Position.set(id, position);
    Health.set(id, 50, 50);
    Stamina.set(id, StaminaData({ current: 100_000, max: 100_000, regen: 5_000, lastRefreshedAt: block.timestamp }));
    RngCommit.set(id, block.number - 1);

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

  function spawnSpider(RoomData memory room, PositionData memory position) internal returns (bytes32) {
    bytes32 id = getUniqueEntityId();

    MonsterType.set(id, uint32(MonsterTypes.Spider));
    Room.set(id, room);
    Position.set(id, position);
    Health.set(id, 5, 5);
    MoveSpeed.set(id, 3);
    Stamina.set(id, StaminaData({ current: 0, max: 25_000, regen: 3_000, lastRefreshedAt: block.timestamp }));
    RngCommit.set(id, block.number - 1);

    Attack.set(
      id,
      AttackData({
        strength: 5,
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
