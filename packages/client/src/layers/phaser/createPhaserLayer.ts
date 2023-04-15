import {
  Coord,
  HueTintAndOutlineFXPipeline,
  createPhaserEngine,
} from "@latticexyz/phaserx";
import {
  Type,
  defineComponent,
  namespaceWorld,
  removeComponent,
  setComponent,
} from "@latticexyz/recs";
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

  const { Main } = scenes;
  const {
    maps: { World, Room },
  } = Main;

  World.setVisible(false);

  function viewWorldMap() {
    World.setVisible(true);
    Room.setVisible(false);

    Main.camera.phaserCamera.centerOn(0, 0);

    removeComponent(components.ActiveRoom, networkLayer.singletonEntity);
  }

  function viewRoomMap(room: Coord) {
    World.setVisible(false);
    Room.setVisible(true);

    setComponent(components.ActiveRoom, networkLayer.singletonEntity, room);
  }

  const layer = {
    networkLayer,
    world,
    game,
    scenes,
    components,
    utils: {
      tintObject,
      map: {
        viewWorldMap,
        viewRoomMap,
      },
    },
  };

  registerSystems(layer);

  return layer;
};
