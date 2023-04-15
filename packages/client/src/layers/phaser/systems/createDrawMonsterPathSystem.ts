import {
  EntityIndex,
  Has,
  UpdateType,
  defineSystem,
  getComponentValue,
  getEntitiesWithValue,
  runQuery,
} from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";
import { Coord } from "@latticexyz/utils";
import { ROOM_HEIGHT, ROOM_WIDTH } from "../../network/types";
import { getStringColor } from "@latticexyz/std-client";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants";

export function createDrawMonsterPathSystem(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      components: { Player, Position, MonsterType, MoveSpeed },
    },
    scenes: {
      Main: { phaserScene },
    },
    components: {
      InActiveRoom, ActiveRoom,
    },
  } = layer;

  type Move = [number, number];

  function cardinalMoves(): Move[] {
    const left: Move = [-1, 0];
    const right: Move = [1, 0];
    const up: Move = [0, -1];
    const down: Move = [0, 1];
    const moves: Move[] = [left, right, up, down];

    return moves;
  }

  type PositionData = {
    position: Coord;
    distanceFromStart: number;
    distanceToTarget: number;
  };

  function manhattan(pointA: Coord, pointB: Coord): number {
    return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
  }

  function isValidPosition(position: Coord) {
    if (
      position.x < 0 ||
      position.x >= ROOM_WIDTH ||
      position.y < 0 ||
      position.y >= ROOM_HEIGHT
    ) {
      return false;
    }

    const blockingEntities = getEntitiesWithValue(Position, position);
    if (blockingEntities.size > 0) return false;

    return true;
  }

  function findClosestPositionWithinMoveLimit(
    start: Coord,
    target: Coord,
    movementLimit: number
  ): { closestPosition: Coord; closestDistanceToTarget: number } {
    const visited: boolean[][] = Array.from({ length: ROOM_WIDTH }, () =>
      new Array(ROOM_HEIGHT).fill(false)
    );

    visited[start.x][start.y] = true;
    const queue: PositionData[] = [];
    const startElement = {
      position: start,
      distanceFromStart: 0,
      distanceToTarget: manhattan(start, target),
    };
    queue.unshift(startElement);

    let closestPosition: Coord = start;
    let closestDistanceToTarget: number = startElement.distanceToTarget;

    while (queue.length !== 0) {
      const currentElement = queue.pop()!;

      if (currentElement.distanceToTarget <= closestDistanceToTarget) {
        closestDistanceToTarget = currentElement.distanceToTarget;
        closestPosition = currentElement.position;
      }

      if (currentElement.distanceToTarget === 1) {
        break;
      }

      if (currentElement.distanceFromStart >= movementLimit) {
        continue;
      }

      const moves: [number, number][] = cardinalMoves();
      for (let i = 0; i < moves.length; i++) {
        const newPosition: Coord = {
          x: currentElement.position.x + moves[i][0],
          y: currentElement.position.y + moves[i][1],
        };

        if (
          isValidPosition(newPosition) &&
          !visited[newPosition.x][newPosition.y]
        ) {
          visited[newPosition.x][newPosition.y] = true;

          const newElement = {
            position: newPosition,
            distanceFromStart: currentElement.distanceFromStart + 1,
            distanceToTarget: manhattan(newPosition, target),
          };
          queue.unshift(newElement);
        }
      }
    }

    return { closestPosition, closestDistanceToTarget };
  }

  function findClosestPlayer(position: Coord) {
    const players = runQuery([Has(Player)]);
    let closestPlayer: EntityIndex | undefined;
    let closestDistance = Infinity;

    for (const player of players) {
      const playerPosition = getComponentValue(Position, player);
      if (!playerPosition) continue;

      const distance = manhattan(position, playerPosition);
      if (distance < closestDistance) {
        closestPlayer = player;
        closestDistance = distance;
      }
    }

    return closestPlayer;
  }

  const monsterGraphics: Record<EntityIndex, Phaser.GameObjects.Group> = {};

  function drawMonsterTarget(monster: EntityIndex, clearOnly = false) {
    if (!monsterGraphics[monster]) {
      monsterGraphics[monster] = phaserScene.add.group();
    }

    monsterGraphics[monster].clear(true, true);
    if(clearOnly) return;

    const monsterPosition = getComponentValue(Position, monster);
    if (!monsterPosition) return;

    const closestPlayer = findClosestPlayer(monsterPosition);
    if (!closestPlayer) return;

    const playerPosition = getComponentValue(Position, closestPlayer);
    if (!playerPosition) return;

    const { closestPosition } = findClosestPositionWithinMoveLimit(
      monsterPosition,
      playerPosition,
      2
    );

    const monsterColor = getStringColor(monster.toString());
    const graphicsGroup = monsterGraphics[monster];

    const pixelCoord = tileCoordToPixelCoord(
      closestPosition,
      TILE_WIDTH,
      TILE_HEIGHT
    );
    const rect = phaserScene.add.rectangle(
      pixelCoord.x + TILE_WIDTH / 2,
      pixelCoord.y + TILE_HEIGHT / 2,
      TILE_WIDTH,
      TILE_HEIGHT,
      monsterColor,
      0.5
    );
    graphicsGroup.add(rect);

    const pixelCoord2 = tileCoordToPixelCoord(
      monsterPosition,
      TILE_WIDTH,
      TILE_HEIGHT
    );
    const rect2 = phaserScene.add.rectangle(
      pixelCoord2.x + TILE_WIDTH / 2,
      pixelCoord2.y + TILE_HEIGHT / 2,
      TILE_WIDTH,
      TILE_HEIGHT,
      monsterColor,
      0.5
    );
    graphicsGroup.add(rect2);
  }

  defineSystem(world, [Has(MonsterType), Has(Position), Has(MoveSpeed), Has(InActiveRoom)], ({ type, entity }) => {
    if(type === UpdateType.Exit) {
      drawMonsterTarget(entity, true);
    }

    const allMonsters = [
      ...runQuery([Has(MonsterType), Has(Position), Has(MoveSpeed)]),
    ];
    for (const monster of allMonsters) {
      drawMonsterTarget(monster);
    }
  });

  defineSystem(world, [Has(Player), Has(Position), Has(InActiveRoom)], () => {
    const allMonsters = [
      ...runQuery([Has(MonsterType), Has(Position), Has(MoveSpeed)]),
    ];
    for (const monster of allMonsters) {
      drawMonsterTarget(monster);
    }
  });

  defineSystem(world, [Has(ActiveRoom)], ({ type }) => {
    if (type === UpdateType.Exit) {
      const allMonsters = [
        ...runQuery([Has(MonsterType), Has(Position), Has(MoveSpeed)]),
      ];
      for (const monster of allMonsters) {
        drawMonsterTarget(monster, true);
      }
    }
  });
}
