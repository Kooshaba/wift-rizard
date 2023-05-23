import {
  Entity,
  Has,
  defineSystem,
  getComponentValue,
  removeComponent,
  setComponent,
} from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";
import { Coord } from "@latticexyz/utils";
import {
  pixelCoordToTileCoord,
  tileCoordToPixelCoord,
} from "@latticexyz/phaserx";
import { Animations, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { ROOM_HEIGHT, ROOM_WIDTH } from "../../network/types";

function isValidPosition(coord: Coord) {
  return (
    coord.x >= 0 &&
    coord.x < ROOM_WIDTH &&
    coord.y >= 0 &&
    coord.y < ROOM_HEIGHT
  );
}

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

  return coordinates.filter((coord) => isValidPosition(coord));
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
    components: { Targeting, PendingAttack },
    scenes: {
      Main: { phaserScene },
    },
    utils: { tintObject, getPlayerAttackData },
    networkLayer: {
      components: { Position },
      utils: {
        txApi: { attack: txAttack },
      },
    },
  } = layer;

  const objectPool = new Map<
    Entity,
    {
      group: Phaser.GameObjects.Group;
      patternGroup: Phaser.GameObjects.Group;
      pendingAttackGroup: Phaser.GameObjects.Group;
    }
  >();

  function highlightTile(coord: Coord, color: number) {
    const pixelCoord = tileCoordToPixelCoord(coord, TILE_WIDTH, TILE_HEIGHT);
    const rect = phaserScene.add.sprite(pixelCoord.x, pixelCoord.y, "");
    rect.play(Animations.TileHighlight);
    tintObject(rect, color);
    rect.setOrigin(0, 0);
    rect.setAlpha(0.75);

    return rect;
  }

  defineSystem(world, [Has(Position), Has(Targeting)], ({ entity }) => {
    if (!objectPool.has(entity)) {
      objectPool.set(entity, {
        group: phaserScene.add.group(),
        patternGroup: phaserScene.add.group(),
        pendingAttackGroup: phaserScene.add.group(),
      });
    }

    objectPool.get(entity)?.group.clear(true, true);
    objectPool.get(entity)?.patternGroup.clear(true, true);

    const targeting = getComponentValue(Targeting, entity);
    if (!targeting) return;

    const { item } = targeting;
    const attack = getPlayerAttackData(entity, item);
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
      const rect = highlightTile(attackOrigin, 0x00ff00);

      const pixelCoord = tileCoordToPixelCoord(
        attackOrigin,
        TILE_WIDTH,
        TILE_HEIGHT
      );
      const interactiveRect = phaserScene.add.rectangle(
        pixelCoord.x,
        pixelCoord.y,
        TILE_WIDTH,
        TILE_HEIGHT,
        undefined,
        0
      );
      interactiveRect.setOrigin(0, 0);
      interactiveRect.setInteractive();

      let renderedAttackPattern: Coord[] | undefined;

      interactiveRect.on("pointerover", () => {
        renderedAttackPattern = [];

        const direction = getDirection(position, attackOrigin);
        const rotatedAttackPattern = rotateAttackPattern(
          attackPattern,
          direction
        );

        for (const coord of rotatedAttackPattern) {
          const attackCoord = {
            x: coord.x + attackOrigin.x,
            y: coord.y + attackOrigin.y,
          };
          if (!isValidPosition(attackCoord)) continue;
          const patternHighlight = highlightTile(attackCoord, 0xffa500);
          objectPool.get(entity)?.patternGroup.add(patternHighlight);
          renderedAttackPattern.push(attackCoord);
        }

        rect.setAlpha(0);
      });

      interactiveRect.on("pointerout", () => {
        rect.setAlpha(0.75);
        renderedAttackPattern = undefined;

        objectPool.get(entity)?.patternGroup.clear(true, true);
      });

      interactiveRect.on("pointerdown", () => {
        const tileCoord = pixelCoordToTileCoord(
          pixelCoord,
          TILE_WIDTH,
          TILE_HEIGHT
        );
        txAttack(item, tileCoord);
        removeComponent(Targeting, entity);

        if (!renderedAttackPattern) return;

        setComponent(PendingAttack, entity, {
          patternXs: renderedAttackPattern.map((c) => c.x),
          patternYs: renderedAttackPattern.map((c) => c.y),
        });
        setTimeout(() => {
          removeComponent(PendingAttack, entity);
        }, 500);
      });

      objectPool.get(entity)?.group.add(rect);
      objectPool.get(entity)?.group.add(interactiveRect);
    }
  });

  defineSystem(world, [Has(PendingAttack)], ({ entity }) => {
    const group = objectPool.get(entity)?.pendingAttackGroup;

    const pattern = getComponentValue(PendingAttack, entity);
    if (!pattern) {
      group?.clear(true);
      return;
    }

    const coords = pattern.patternXs.map((x, i) => {
      return {
        x,
        y: pattern.patternYs[i],
      } as Coord;
    });

    for (const coord of coords) {
      const h = highlightTile(coord, 0xb00b1e);
      group?.add(h);
    }
  });
}
