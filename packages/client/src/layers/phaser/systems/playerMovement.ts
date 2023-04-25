import {
  coordEq,
  pixelCoordToTileCoord,
  tileCoordToPixelCoord,
} from "@latticexyz/phaserx";
import { PhaserLayer } from "../createPhaserLayer";
import { Animations, TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { Coord } from "@latticexyz/utils";
import {
  Has,
  defineEnterSystem,
  getComponentValueStrict,
  hasComponent,
  runQuery,
} from "@latticexyz/recs";

export function playerMovement(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      components: { Position, Player, MoveSpeed },
      utils: {
        isValidPosition,
        txApi: { move },
      },
      singletonEntity,
    },
    components: { Targeting, ActiveRoom },
    scenes: {
      Main: { input, phaserScene },
    },
    utils: { tintObject },
  } = layer;

  const tileHighlights = phaserScene.add.group();

  function bfs(start: Coord, end: Coord, limit: number): Coord[] {
    if (!isValidPosition(end)) return [];

    const visited = new Set<string>();
    const queue: { coord: Coord; path: Coord[]; limit: number }[] = [
      { coord: start, path: [], limit },
    ];

    while (queue.length > 0) {
      const { coord, path, limit } = queue.shift()!;

      if (coord.x === end.x && coord.y === end.y) return path.concat([coord]);

      if (!coordEq(coord, start) && !isValidPosition(coord)) continue;
      if (limit <= 0 || visited.has(`${coord.x},${coord.y}`)) continue;

      visited.add(`${coord.x},${coord.y}`);
      const neighbors: Coord[] = [
        { x: coord.x - 1, y: coord.y },
        { x: coord.x + 1, y: coord.y },
        { x: coord.x, y: coord.y - 1 },
        { x: coord.x, y: coord.y + 1 },
      ];

      for (const neighbor of neighbors) {
        queue.push({
          coord: neighbor,
          path: path.concat([coord]),
          limit: limit - 1,
        });
      }
    }

    return [];
  }

  function highlightTile(coord: Coord) {
    const pixelCoord = tileCoordToPixelCoord(coord, TILE_WIDTH, TILE_HEIGHT);

    const highlight = phaserScene.add
      .sprite(pixelCoord.x, pixelCoord.y, "")
      .setOrigin(0, 0)
      .setAlpha(0.75)
      .play(Animations.TileOutline)
      .setInteractive();

    highlight.on("pointerdown", () => {
      const player = [...runQuery([Has(Player), Has(Position)])][0];
      if (hasComponent(Targeting, player)) return;

      const start = getComponentValueStrict(Position, player);
      const end = coord;
      const moveSpeed = getComponentValueStrict(MoveSpeed, player).value;

      const path = bfs(start, end, moveSpeed);

      if (path.length === 0) return;

      move(path.slice(1));
    });

    tintObject(highlight, 0x00ff00);

    tileHighlights.add(highlight);
  }

  defineEnterSystem(world, [Has(Targeting)], () => {
    tileHighlights.clear(true, true);
  });

  input.pointermove$.subscribe((e) => {
    tileHighlights.clear(true, true);

    const player = [...runQuery([Has(Player), Has(Position)])][0];
    if (hasComponent(Targeting, player)) return;

    if (!hasComponent(ActiveRoom, singletonEntity)) return;

    const tileCoord = pixelCoordToTileCoord(
      {
        x: e.pointer.worldX,
        y: e.pointer.worldY,
      },
      TILE_WIDTH,
      TILE_HEIGHT
    );

    const start = getComponentValueStrict(Position, player);
    const end = tileCoord;
    const moveSpeed = getComponentValueStrict(MoveSpeed, player).value;

    const path = bfs(start, end, moveSpeed);

    for (const coord of path) {
      highlightTile({ x: coord.x, y: coord.y });
    }
  });
}
