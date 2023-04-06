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
      Main: {
        objectPool,
        camera: { phaserCamera },
      },
    },
    networkLayer: {
      components: { Health, Position },
      playerEntity,
    },
  } = layer;

  defineSystem(world, [Has(Health), Has(Position)], (update) => {
    if (!isComponentUpdate(update, Health)) return;
    if (update.type === UpdateType.Enter) return;

    const { entity, value } = update;
    const [current, previous] = value.map((v) => (v?.value ?? 0) as number);
    if (current > previous) return;

    if (entity === playerEntity) phaserCamera.shake(100, 0.0005);

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
