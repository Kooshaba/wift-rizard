import {
  Coord,
  HueTintAndOutlineFXPipeline,
  createPhaserEngine,
} from "@latticexyz/phaserx";
import {
  EntityIndex,
  Type,
  defineComponent,
  getComponentValue,
  namespaceWorld,
  removeComponent,
  setComponent,
} from "@latticexyz/recs";
import { NetworkLayer } from "../network/createNetworkLayer";
import { registerSystems } from "./systems";
import { TILE_HEIGHT, TILE_WIDTH } from "./constants";

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

    const playerRoom = getComponentValue(
      components.ActiveRoom,
      networkLayer.singletonEntity
    );
    Main.camera.phaserCamera.centerOn(
      (playerRoom?.x ?? 0) * TILE_WIDTH,
      (playerRoom?.y ?? 0) * TILE_HEIGHT
    );

    removeComponent(components.ActiveRoom, networkLayer.singletonEntity);
  }

  function viewRoomMap(room: Coord) {
    World.setVisible(false);
    Room.setVisible(true);

    Main.camera.phaserCamera.centerOn(
      5 * TILE_WIDTH,
      4 * TILE_HEIGHT
    );

    setComponent(components.ActiveRoom, networkLayer.singletonEntity, room);
  }

  function getPlayerAttackData(player: EntityIndex, item: EntityIndex) {
    const { Attack, BonusAttributes } = networkLayer.components;

    const attackData = getComponentValue(Attack, item);
    if (!attackData) return;

    const bonusAttributes = getComponentValue(BonusAttributes, player);
    if (!bonusAttributes) return;

    return {
      item,
      ...attackData,
      strength: attackData.strength + bonusAttributes.strength,
      staminaCost: attackData.staminaCost + bonusAttributes.staminaCost,
      minRange: attackData.minRange + bonusAttributes.rangeMin,
      maxRange: attackData.maxRange + bonusAttributes.rangeMax,
    };
  }

  const layer = {
    networkLayer,
    world,
    game,
    scenes,
    components,
    utils: {
      tintObject,
      getPlayerAttackData,
      map: {
        viewWorldMap,
        viewRoomMap,
      },
    },
  };

  registerSystems(layer);

  return layer;
};
