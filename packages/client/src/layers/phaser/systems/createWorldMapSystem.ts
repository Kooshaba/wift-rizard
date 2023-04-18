import {
  Has,
  UpdateType,
  defineSystem,
  getComponentValue,
  runQuery,
} from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";
import { Coord } from "@latticexyz/utils";
import {
  pixelCoordToTileCoord,
  tileCoordToPixelCoord,
} from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { Subscription } from "rxjs";

export function createWorldMapSystem(layer: PhaserLayer) {
  const {
    components: { ActiveRoom },
    networkLayer: {
      world,
      components: { Room, Player, MonsterType },
      singletonEntity,
      playerEntity,
    },
    scenes: {
      Main: { phaserScene, input },
    },
    utils: {
      map: { viewRoomMap },
    },
  } = layer;

  function coordEquals(a: Coord | undefined, b: Coord | undefined) {
    return a?.x === b?.x && a?.y === b?.y;
  }

  const spriteGroup = phaserScene.add.group();

  function drawWorldMap() {
    spriteGroup.clear(true, true);

    const activeRoom = getComponentValue(ActiveRoom, singletonEntity);
    if (activeRoom) return;

    const playerRoom = playerEntity
      ? getComponentValue(Room, playerEntity)
      : undefined;

    const uniqueRooms = new Set<string>();
    function addRoom(coord: Coord) {
      const room = `${coord.x},${coord.y}`;
      uniqueRooms.add(room);
    }
    function decodeRoom(roomString: string): Coord {
      const [x, y] = roomString.split(",");
      return {
        x: parseInt(x),
        y: parseInt(y),
      };
    }

    const playersInRooms = runQuery([Has(Room), Has(Player)]);
    playersInRooms.forEach((entity) => {
      const room = getComponentValue(Room, entity);
      if (!room) return;

      addRoom(room);
    });

    const monstersInRooms = runQuery([Has(Room), Has(MonsterType)]);
    monstersInRooms.forEach((entity) => {
      const room = getComponentValue(Room, entity);
      if (!room) return;

      addRoom(room);
    });

    const rooms = Array.from(uniqueRooms);
    rooms.forEach((room) => {
      const roomCoord = decodeRoom(room);

      const pixelCoord = tileCoordToPixelCoord(
        roomCoord,
        TILE_WIDTH,
        TILE_HEIGHT
      );
      const color = coordEquals(roomCoord, playerRoom) ? 0x00ff00 : 0xff0000;
      const rect = phaserScene.add.rectangle(
        pixelCoord.x,
        pixelCoord.y,
        TILE_WIDTH,
        TILE_HEIGHT,
        color,
        0.5
      );
      spriteGroup.add(rect);
      rect.setOrigin(0);

      // blink
      phaserScene.tweens.add({
        targets: rect,
        alpha: 0.3,
        duration: 750,
        ease: "Linear",
        yoyo: true,
        repeat: -1,
      });
    });
  }

  defineSystem(world, [Has(Player), Has(Room)], () => {
    drawWorldMap();
  });

  defineSystem(world, [Has(ActiveRoom)], () => {
    drawWorldMap();
  });

  let worldMapClickSub: Subscription | undefined;
  defineSystem(world, [Has(ActiveRoom)], ({ type }) => {
    if (type === UpdateType.Exit) {
      worldMapClickSub = input.click$.subscribe((e) => {
        const tileCoord = pixelCoordToTileCoord(
          {
            x: e.worldX,
            y: e.worldY,
          },
          TILE_WIDTH,
          TILE_HEIGHT
        );

        viewRoomMap(tileCoord);
      });
    } else if (type === UpdateType.Enter) {
      worldMapClickSub?.unsubscribe();
      worldMapClickSub = undefined;
    }
  });
}
