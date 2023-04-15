import { HueTintAndOutlineFXPipeline } from "@latticexyz/phaserx";
import {
  defineSystem,
  getComponentValue,
  Has,
  UpdateType,
} from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";
import { MonsterTypeAnimations, MonsterTypeColors } from "../../network/types";

export function createMonsterSystem(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      components: { MonsterType },
    },
    scenes: {
      Main: { objectPool },
    },
    components: { InActiveRoom },
  } = layer;

  defineSystem(
    world,
    [Has(MonsterType), Has(InActiveRoom)],
    ({ entity, type }) => {
      if (type === UpdateType.Exit) {
        objectPool.remove(entity);
        return;
      }

      const monsterType = getComponentValue(MonsterType, entity);
      if (!monsterType) return;

      const animation = MonsterTypeAnimations[monsterType.value];
      if (!animation) return;

      const color = MonsterTypeColors[monsterType.value];

      const obj = objectPool.get(entity, "Sprite");
      obj.setComponent({
        id: "appearance",
        once: (sprite) => {
          sprite.play(animation);
          sprite.setPipeline(HueTintAndOutlineFXPipeline.KEY);
          sprite.setPipelineData("hueTint", color);
        },
      });
    }
  );
}
