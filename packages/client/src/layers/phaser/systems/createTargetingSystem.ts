import {
  EntityIndex,
  Has,
  defineComponentSystem,
  defineSystem,
  getComponentValue,
  removeComponent,
} from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";
import { Coord } from "@latticexyz/utils";
import {
  pixelCoordToTileCoord,
  tileCoordToPixelCoord,
} from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants";

function generateAttackableCoords(
  coord: Coord,
  minRange: number,
  maxRange: number
) {
  const { x, y } = coord;
  const coordinates = [];

  for (let i = minRange; i <= maxRange; i++) {
    if (i !== 0) {
      coordinates.push({ x: x + i, y }); // Right
      coordinates.push({ x: x - i, y }); // Left
      coordinates.push({ x, y: y - i }); // Up
      coordinates.push({ x, y: y + i }); // Down
    }
  }

  return coordinates;
}

enum Direction {
  Up,
  Right,
  Down,
  Left,
}

function getDirection(coord1: Coord, coord2: Coord): Direction {
  const deltaX = coord2.x - coord1.x;
  const deltaY = coord2.y - coord1.y;

  if (deltaX === 0 && deltaY > 0) {
    return Direction.Up;
  } else if (deltaX > 0 && deltaY === 0) {
    return Direction.Right;
  } else if (deltaX === 0 && deltaY < 0) {
    return Direction.Down;
  } else if (deltaX < 0 && deltaY === 0) {
    return Direction.Left;
  } else {
    throw new Error(
      "Invalid coordinates. The points must be either horizontally or vertically aligned."
    );
  }
}

function rotateAttackPattern(pattern: Coord[], direction: Direction): Coord[] {
  const patternLength = pattern.length;
  const rotatedPattern: Coord[] = [];

  if (direction === Direction.Up) {
    return pattern;
  }

  for (let i = 0; i < patternLength; i++) {
    const x = pattern[i].x;
    const y = pattern[i].y;

    if (direction === Direction.Right) {
      rotatedPattern.push({ x: y, y: x });
    } else if (direction === Direction.Down) {
      rotatedPattern.push({ x: -x, y: -y });
    } else if (direction === Direction.Left) {
      rotatedPattern.push({ x: -y, y: -x });
    }
  }

  return rotatedPattern;
}

export function createTargetingSystem(layer: PhaserLayer) {
  const {
    world,
    components: { Targeting },
    scenes: {
      Main: { phaserScene },
    },
    networkLayer: {
      components: { Attack, Position },
      utils: {
        txApi: { attack: txAttack },
      },
    },
  } = layer;

  const objectPool = new Map<
    EntityIndex,
    {
      group: Phaser.GameObjects.Group;
      patternGroup: Phaser.GameObjects.Group;
      listeners: (() => void)[];
    }
  >();

  defineSystem(world, [Has(Position), Has(Targeting)], ({ entity, type }) => {
    if (!objectPool.has(entity)) {
      objectPool.set(entity, {
        group: phaserScene.add.group(),
        patternGroup: phaserScene.add.group(),
        listeners: [],
      });
    }

    objectPool.get(entity)?.group.clear(true, true);
    objectPool.get(entity)?.patternGroup.clear(true, true);

    const targeting = getComponentValue(Targeting, entity);
    if (!targeting) return;

    const item = world.getEntityIndexStrict(targeting.item);
    const attack = getComponentValue(Attack, item);
    if (!attack) return;

    const attackPattern: Coord[] = [];
    for (let i = 0; i < attack.patternX.length; i++) {
      attackPattern.push({
        x: attack.patternX[i],
        y: attack.patternY[i],
      });
    }

    const position = getComponentValue(Position, entity);
    if (!position) return;

    const attackableCoords = generateAttackableCoords(
      position,
      attack.minRange,
      attack.maxRange
    );
    for (const attackOrigin of attackableCoords) {
      const pixelCoord = tileCoordToPixelCoord(
        attackOrigin,
        TILE_WIDTH,
        TILE_HEIGHT
      );
      const rect = phaserScene.add.rectangle(
        pixelCoord.x,
        pixelCoord.y,
        TILE_WIDTH,
        TILE_HEIGHT,
        0x00ff00,
        0.5
      );
      rect.setOrigin(0, 0);
      rect.setInteractive();

      rect.on("pointerover", () => {
        const direction = getDirection(position, attackOrigin);
        const rotatedAttackPattern = rotateAttackPattern(
          attackPattern,
          direction
        );

        for (const coord of rotatedAttackPattern) {
          const pixelCoord = tileCoordToPixelCoord(
            { x: coord.x + attackOrigin.x, y: coord.y + attackOrigin.y },
            TILE_WIDTH,
            TILE_HEIGHT
          );
          const rect = phaserScene.add.rectangle(
            pixelCoord.x,
            pixelCoord.y,
            TILE_WIDTH,
            TILE_HEIGHT,
            0xffa500,
            0.8
          );
          rect.setOrigin(0, 0);
          objectPool.get(entity)?.patternGroup.add(rect);
        }

        rect.setFillStyle(0x00ff00, 0);
      });

      rect.on("pointerout", () => {
        rect.setFillStyle(0x00ff00, 0.5);
        objectPool.get(entity)?.patternGroup.clear(true, true);
      });

      rect.on("pointerdown", () => {
        const tileCoord = pixelCoordToTileCoord(
          pixelCoord,
          TILE_WIDTH,
          TILE_HEIGHT
        );
        txAttack(item, tileCoord);
        removeComponent(Targeting, entity);
      });

      objectPool.get(entity)?.group.add(rect);
    }
  });
}
