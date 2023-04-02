import {
  Has,
  UpdateType,
  defineSystem,
  getComponentValueStrict,
  isComponentUpdate,
} from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";
import { tileCoordToPixelCoord, tween } from "@latticexyz/phaserx";

export function createDamageSystem(layer: PhaserLayer) {
  const {
    world,
    scenes: {
      Main: { objectPool, phaserScene },
    },
    networkLayer: {
      components: { Health, Position },
    },
  } = layer;

  defineSystem(world, [Has(Health), Has(Position)], (update) => {
    if (!isComponentUpdate(update, Health)) return;
    if (update.type === UpdateType.Enter) return;

    const { entity } = update;

    const obj = objectPool.get(entity, "Sprite");
    obj.setComponent({
      id: "damage",
      now: (sprite) => {
        tween({
          targets: sprite,
          duration: 100,
          alpha: 0.25,
          angle: 10,
          yoyo: true,
          repeat: 1,
          ease: "Sine.easeInOut",
        });
      },
    });
  });
}
