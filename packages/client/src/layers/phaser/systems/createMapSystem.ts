import { sample } from "lodash";
import { Tileset } from "../../../artTypes/terrain";
import { ROOM_WIDTH, ROOM_HEIGHT } from "../../network/types";
import { PhaserLayer } from "../createPhaserLayer";
import {
  Has,
  HasValue,
  UpdateType,
  defineSystem,
  getComponentValue,
} from "@latticexyz/recs";

export function createMapSystem(layer: PhaserLayer) {
  const {
    networkLayer: {
      world,
      components: { Room, Player },
      utils: { onPlayerLoaded },
    },
    scenes: {
      Main: {
        maps: {
          Main: { putTileAt },
        },
      },
    },
  } = layer;

  const groundTiles = [
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground1,
    Tileset.Ground2,
    Tileset.Ground3,
  ]

  onPlayerLoaded((playerData) => {
    if (!playerData) return;

    const { playerNumber } = playerData;

    defineSystem(
      world,
      [HasValue(Player, { value: playerNumber }), Has(Room)],
      ({ entity, type }) => {
        if (type !== UpdateType.Enter) return;

        const room = getComponentValue(Room, entity);
        if (!room) return;

        for (let x = -1; x <= ROOM_WIDTH; x++) {
          for (let y = -1; y <= ROOM_HEIGHT; y++) {
            const coord = { x, y };

            if ((y === -1 && x !== -1 && x !== ROOM_WIDTH) || y === ROOM_HEIGHT) {
              putTileAt(coord, Tileset.WallX, "Background");
            } else if (x === -1 || x === ROOM_WIDTH) {
              putTileAt(coord, Tileset.WallY, "Background");
            } else {
              putTileAt(coord, sample(groundTiles)!, "Background");
            }
          }
        }
      }
    );
  });
}
