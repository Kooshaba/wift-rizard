// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";

import { Player, PlayerTableId } from "../codegen/tables/Player.sol";
import { Position, PositionData, PositionTableId } from "../codegen/tables/Position.sol";
import { Spawner } from "../codegen/tables/Spawner.sol";
import { MonsterType } from "../codegen/tables/MonsterType.sol";
import { Health } from "../codegen/tables/Health.sol";
import { Room, RoomData, RoomTableId } from "../codegen/tables/Room.sol";
import { RngCommit } from "../codegen/tables/RngCommit.sol";
import { MoveSpeed } from "../codegen/tables/MoveSpeed.sol";
import { Attack, AttackData } from "../codegen/tables/Attack.sol";

import { MonsterTypes } from "../Types.sol";

import { LibMonster } from "../libraries/LibMonster.sol";
import { LibPosition, ROOM_WIDTH, ROOM_HEIGHT } from "../libraries/LibPosition.sol";
import { LibStamina } from "../libraries/LibStamina.sol";
import { LibRandom } from "../libraries/LibRandom.sol";
import { PositionQueue } from "../libraries/PositionQueue.sol";

import { addressToEntity, getUniqueEntityId } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

contract MonsterSystem is System {
  function act(bytes32 monster) public {
    require(MonsterType.get(monster) != 0, "Not a monster");

    uint256 randomSeed = LibRandom.getSeed(monster) % 10;

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

    require(playerCount > 0, "no players in room");

    bytes32 closestPlayer = 0;
    PositionData memory closestPlayerPosition;
    int32 closestPlayerDistance = 200;

    for (uint256 i = 0; i < playerCount; i++) {
      PositionData memory playerPosition = Position.get(playersInRoom[i]);
      int32 distance = LibPosition.manhattan(playerPosition, position);
      if (closestPlayer == 0 || distance < closestPlayerDistance) {
        closestPlayer = playersInRoom[i];
        closestPlayerPosition = playerPosition;
        closestPlayerDistance = distance;
      }
    }

    if (closestPlayer != 0) {
      int32 monsterMoveSpeed = MoveSpeed.get(monster);

      (PositionData memory closestPosition, int32 closestDistance) = findClosestPosition(
        position,
        closestPlayerPosition,
        monsterMoveSpeed
      );

      Position.set(monster, closestPosition);
      LibStamina.spend(monster, 25_000);

      // still doesn't support ranged units
      if (closestDistance == 1) {
        AttackData memory attack = Attack.get(monster);
        int32 currentPlayerHealth = Health.getCurrent(closestPlayer);

        if (attack.strength >= currentPlayerHealth) {
          Health.deleteRecord(closestPlayer);
          Player.deleteRecord(closestPlayer);
          Position.deleteRecord(closestPlayer);
          Room.deleteRecord(closestPlayer);
        } else {
          Health.setCurrent(closestPlayer, currentPlayerHealth - attack.strength);
        }
      }
    } else {
      revert("No players in room");
    }
  }

  function findClosestPosition(
    PositionData memory start,
    PositionData memory target,
    int32 movementLimit
  ) private view returns (PositionData memory closestPosition, int32 closestDistanceToTarget) {
    int32[ROOM_HEIGHT][ROOM_WIDTH] memory visited;

    visited[toUint256(start.x)][toUint256(start.y)] = 1;
    PositionQueue.Queue memory queue = PositionQueue.create();
    PositionQueue.Element memory startElement = PositionQueue.Element({
      position: start,
      distanceFromStart: 0,
      distanceToTarget: LibPosition.manhattan(start, target)
    });
    PositionQueue.enqueue(queue, startElement);

    closestPosition = start;
    closestDistanceToTarget = startElement.distanceToTarget;

    while (!PositionQueue.isEmpty(queue)) {
      PositionQueue.Element memory currentElement = PositionQueue.dequeue(queue);

      // found new closest position
      if (currentElement.distanceToTarget <= closestDistanceToTarget) {
        closestDistanceToTarget = currentElement.distanceToTarget;
        closestPosition = currentElement.position;
      }

      // adjacent
      if (currentElement.distanceToTarget == 1) {
        break;
      }

      if (currentElement.distanceFromStart >= movementLimit) {
        continue;
      }

      int32[2][4] memory moves = cardinalMoves();
      for (uint256 i = 0; i < moves.length; i++) {
        PositionData memory newPosition = PositionData(
          currentElement.position.x + moves[i][0],
          currentElement.position.y + moves[i][1]
        );


        if (isValidPosition(newPosition) && visited[toUint256(newPosition.x)][toUint256(newPosition.y)] != 1) {
          visited[toUint256(newPosition.x)][toUint256(newPosition.y)] = 1;

          PositionQueue.Element memory newElement = PositionQueue.Element({
            position: newPosition,
            distanceFromStart: currentElement.distanceFromStart + 1,
            distanceToTarget: LibPosition.manhattan(newPosition, target)
          });
          PositionQueue.enqueue(queue, newElement);
        }
      }
    }
  }

  function isValidPosition(PositionData memory position) private view returns (bool) {
    if (position.x < 0 || position.x >= ROOM_WIDTH || position.y < 0 || position.y >= ROOM_HEIGHT) {
      return false;
    }

    bytes32[] memory entitiesAtPosition = getKeysWithValue(PositionTableId, Position.encode(position.x, position.y));
    if (entitiesAtPosition.length > 0) {
      return false;
    }

    return true;
  }

  function toUint256(int32 x) private pure returns (uint256) {
    return uint256(uint32(x));
  }

  function cardinalMoves() private pure returns (int32[2][4] memory) {
    int32[2] memory left = [int32(-1), int32(0)];
    int32[2] memory right = [int32(1), int32(0)];
    int32[2] memory up = [int32(0), int32(-1)];
    int32[2] memory down = [int32(0), int32(1)];
    int32[2][4] memory moves = [left, right, up, down];

    return moves;
  }
}
