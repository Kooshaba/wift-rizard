import { Has, defineSystem, getComponentValue, runQuery, setComponent } from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";
import { uniq } from "lodash";
import { Coord } from "@latticexyz/utils";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants";

export function createWorldMapSystem(layer: PhaserLayer) {
  const {
    components: { ActiveRoom },
    networkLayer: {
      world,
      components: { Room, Player },
      singletonEntity,
    },
    scenes: {
      Main: {
        phaserScene,
      },
    },
    utils: {
      map: {
        viewRoomMap,
      }
    }
  } = layer;

  const spriteGroup = phaserScene.add.group();

  defineSystem(world, [Has(ActiveRoom)], ({ type }) => {
    spriteGroup.clear(true, true);

    const activeRoom = getComponentValue(ActiveRoom, singletonEntity);
    if (activeRoom) return;

    const uniqueRooms = new Set<Coord>();

    const playersInRooms = runQuery([Has(Room), Has(Player)]);
    playersInRooms.forEach((entity) => {
      const room = getComponentValue(Room, entity);
      if (!room) return;

      uniqueRooms.add(room);
    });

    const rooms = Array.from(uniqueRooms);
    rooms.forEach((room) => {
      const pixelCoord = tileCoordToPixelCoord(room, TILE_WIDTH, TILE_HEIGHT);
      const rect = phaserScene.add.rectangle(pixelCoord.x, pixelCoord.y, TILE_WIDTH, TILE_HEIGHT, 0x881188, 0.5);
      spriteGroup.add(rect);
      rect.setOrigin(0);
      rect.setInteractive();
      rect.on("pointerdown", () => {
        viewRoomMap(room);
      });

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
  });
}
