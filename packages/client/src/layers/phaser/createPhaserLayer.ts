import {
  HueTintAndOutlineFXPipeline,
  createPhaserEngine,
} from "@latticexyz/phaserx";
import { Type, defineComponent, namespaceWorld } from "@latticexyz/recs";
import { NetworkLayer } from "../network/createNetworkLayer";
import { registerSystems } from "./systems";

export type PhaserLayer = Awaited<ReturnType<typeof createPhaserLayer>>;
type PhaserEngineConfig = Parameters<typeof createPhaserEngine>[0];

export const createPhaserLayer = async (
  networkLayer: NetworkLayer,
  phaserConfig: PhaserEngineConfig
) => {
  const world = namespaceWorld(networkLayer.world, "phaser");

  const {
    game,
    scenes,
    dispose: disposePhaser,
  } = await createPhaserEngine(phaserConfig);
  world.registerDisposer(disposePhaser);

  const components = {
    Targeting: defineComponent(
      world,
      {
        item: Type.Entity,
      },
      { id: "Targeting" }
    ),
    PendingAttack: defineComponent(
      world,
      {
        patternXs: Type.NumberArray,
        patternYs: Type.NumberArray,
      },
      { id: "PendingAttack" }
    ),
    ActiveRoom: defineComponent(
      world,
      {
        x: Type.Number,
        y: Type.Number,
      },
      { id: "ActiveRoom" }
    ),
    InActiveRoom: defineComponent(
      world,
      {
        value: Type.Boolean,
      },
      { id: "InActiveRoom" }
    ),
  };

  function tintObject(
    gameObject: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image,
    color: number
  ) {
    gameObject.setPipeline(HueTintAndOutlineFXPipeline.KEY);
    gameObject.setPipelineData("hueTint", color);
  }

  const layer = {
    networkLayer,
    world,
    game,
    scenes,
    components,
    utils: {
      tintObject,
    },
  };

  registerSystems(layer);

  return layer;
};
