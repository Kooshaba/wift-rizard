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
import { MoveSpeed } from "../tables/MoveSpeed.sol";

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
    int32 closestPlayerDistance = 200;

    for (uint256 i = 0; i < playerCount; i++) {
      PositionData memory playerPosition = Position.get(playersInRoom[i]);
      int32 distance = LibPosition.manhattan(playerPosition, position);
      if (closestPlayer == 0 || distance < closestPlayerDistance) {
        closestPlayer = playersInRoom[i];
        closesPlayerPosition = playerPosition;
        closestPlayerDistance = distance;
      }
    }

    if (closestPlayer != 0) {
      int32 monsterMoveSpeed = MoveSpeed.get(monster);

      (PositionData memory closestPosition, int32 closestDistance) = findClosestPosition(
        position,
        closesPlayerPosition,
        monsterMoveSpeed
      );

      Position.set(monster, closestPosition);
      LibStamina.spend(monster, 25_000);

      // still doesn't support ranged units
      if (closestDistance == 1) {
        int32 damage = 10;
        int32 currentPlayerHealth = Health.getCurrent(closestPlayer);

        if (damage >= currentPlayerHealth) {
          Health.deleteRecord(closestPlayer);
          Player.deleteRecord(closestPlayer);
          Position.deleteRecord(closestPlayer);
          Room.deleteRecord(closestPlayer);
        } else {
          Health.setCurrent(closestPlayer, currentPlayerHealth - damage);
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
    int32[ROOM_SIZE][ROOM_SIZE] memory visited;
    for (int32 i = 0; i < ROOM_SIZE; i++) {
      for (int32 j = 0; j < ROOM_SIZE; j++) {
        visited[toUint256(i)][toUint256(j)] = -1;
      }
    }

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
      if (currentElement.distanceToTarget < closestDistanceToTarget) {
        closestDistanceToTarget = currentElement.distanceToTarget;
        closestPosition = currentElement.position;
      }

      // adjacent
      if (currentElement.distanceToTarget == 1) {
        break;
      }

      // out of movement
      if (currentElement.distanceFromStart >= movementLimit) {
        continue;
      }

      int32[2][4] memory moves = cardinalMoves();
      for (uint256 i = 0; i < moves.length; i++) {
        PositionData memory newPosition = PositionData(
          currentElement.position.x + moves[i][0],
          currentElement.position.y + moves[i][1]
        );

        if (isValidPosition(newPosition) && visited[toUint256(newPosition.x)][toUint256(newPosition.y)] == -1) {
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
    if (position.x < 0 || position.x >= ROOM_SIZE || position.y < 0 || position.y >= ROOM_SIZE) {
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
