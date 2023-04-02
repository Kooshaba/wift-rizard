// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";

import { Player, PlayerTableId } from "../tables/Player.sol";
import { Position, PositionData, PositionTableId } from "../tables/Position.sol";
import { Spawner } from "../tables/Spawner.sol";
import { MonsterType } from "../tables/MonsterType.sol";
import { Health } from "../tables/Health.sol";
import { Room, RoomData, RoomTableId } from "../tables/Room.sol";
import { RngCommit } from "../tables/RngCommit.sol";

import { MonsterTypes } from "../Types.sol";

import { LibMonster } from "../libraries/LibMonster.sol";
import { LibPosition, ROOM_SIZE } from "../libraries/LibPosition.sol";
import { LibStamina } from "../libraries/LibStamina.sol";
import { PositionQueue } from "../libraries/PositionQueue.sol";

import { addressToEntity, getUniqueEntityId } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

contract MonsterSystem is System {
  function act(bytes32 monster) public {
    require(MonsterType.get(monster) != 0, "Not a monster");

    uint256 commitBlock = RngCommit.get(monster);
    uint256 randomSeed = uint256(blockhash(commitBlock));
    RngCommit.set(monster, block.number);

    RoomData memory room = Room.get(monster);
    bytes32[] memory entitiesInRoom = getKeysWithValue(RoomTableId, Room.encode(room.x, room.y));

    moveToOrAttackClosestPlayer(randomSeed, monster, entitiesInRoom);
  }

  function moveToOrAttackClosestPlayer(uint256 randomSeed, bytes32 monster, bytes32[] memory entities) private {
    PositionData memory position = Position.get(monster);

    bytes32[] memory playersInRoom = new bytes32[](entities.length);
    uint256 playerCount = 0;
    for (uint256 i = 0; i < entities.length; i++) {
      if (Player.get(entities[i]) != 0) {
        playersInRoom[i] = entities[i];
        playerCount++;
      }
    }

    bytes32 closestPlayer = 0;
    PositionData memory closesPlayerPosition;
    int32 closestDistance = 200;

    for (uint256 i = 0; i < playerCount; i++) {
      PositionData memory playerPosition = Position.get(playersInRoom[i]);
      int32 distance = LibPosition.manhattan(playerPosition, position);
      if (closestPlayer == 0 || distance < closestDistance) {
        closestPlayer = playersInRoom[i];
        closesPlayerPosition = playerPosition;
        closestDistance = distance;
      }
    }

    if (closestPlayer != 0) {
      if (closestDistance == 1) {
        int32 damage = 10;
        int32 currentPlayerHealth = Health.getCurrent(closestPlayer);

        if (damage > currentPlayerHealth) {
          Health.deleteRecord(closestPlayer);
          Player.deleteRecord(closestPlayer);
          Position.deleteRecord(closestPlayer);
          Room.deleteRecord(closestPlayer);
        } else {
          Health.setCurrent(closestPlayer, currentPlayerHealth - damage);
        }
        LibStamina.spend(monster, 25_000);
      } else {
        int32 x = position.x;
        int32 y = position.y;
        if (closesPlayerPosition.x > position.x) {
          x++;
        } else if (closesPlayerPosition.x < position.x) {
          x--;
        } else if (closesPlayerPosition.y > position.y) {
          y++;
        } else if (closesPlayerPosition.y < position.y) {
          y--;
        }

        bytes32[] memory entitiesAtPosition = getKeysWithValue(PositionTableId, Position.encode(x, y));
        if (entitiesAtPosition.length > 0) {
          return;
        }

        if (x < 0 || x >= ROOM_SIZE || y < 0 || y >= ROOM_SIZE) {
          return;
        }

        LibStamina.spend(monster, 25_000);
        Position.set(monster, x, y);
      }
    } else {
      revert("No players in room");
    }
  }
}
