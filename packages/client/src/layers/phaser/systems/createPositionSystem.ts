import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { defineSystem, getComponentValue, Has, UpdateType } from "@latticexyz/recs";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";

export function createPositionSystem(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      components: { Position },
    },
    scenes: {
      Main: { objectPool },
    },
    components: {
      InActiveRoom,
    },
  } = layer;

  defineSystem(world, [Has(Position), Has(InActiveRoom)], ({ entity, type }) => {
    if(type === UpdateType.Exit) {
      objectPool.remove(entity);
      return;
    }

    const position = getComponentValue(Position, entity);
    if(!position) return;

    const pixelCoord = tileCoordToPixelCoord(position, TILE_WIDTH, TILE_HEIGHT);

    const obj = objectPool.get(entity, "Sprite");
    obj.setComponent({
      id: "position",
      once: (sprite) => {
        sprite.setPosition(pixelCoord.x, pixelCoord.y);
      },
    });
  });
}