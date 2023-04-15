import { HueTintAndOutlineFXPipeline } from "@latticexyz/phaserx";
import { defineSystem, Has } from "@latticexyz/recs";
import { getStringColor } from "@latticexyz/std-client";
import { Animations } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";

export function createPlayerSystem(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      components: { Player, Position },
    },
    scenes: {
      Main: { objectPool },
    },
    components: {
      InActiveRoom
    },
  } = layer;

  defineSystem(world, [Has(Player), Has(Position), Has(InActiveRoom)], ({ entity }) => {
    const obj = objectPool.get(entity, "Sprite");
    obj.setComponent({
      id: 'appearance',
      once: (sprite) => {
        sprite.play(Animations.Hero);
        sprite.setPipeline(HueTintAndOutlineFXPipeline.KEY);
        sprite.setPipelineData("hueTint", getStringColor(world.entities[entity]));
      }
    });
  });
}
