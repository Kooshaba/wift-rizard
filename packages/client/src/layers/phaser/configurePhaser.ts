import {
  defineSceneConfig,
  AssetType,
  defineScaleConfig,
  defineMapConfig,
  defineCameraConfig,
} from "@latticexyz/phaserx";
import terrainTilesetImage from "../../../public/assets/tilesets/terrain.png";
import { Tileset as TerrainTileset } from "../../artTypes/terrain";
import {
  Sprites,
  Assets,
  Maps,
  Scenes,
  TILE_HEIGHT,
  TILE_WIDTH,
  Animations,
} from "./constants";

const ANIMATION_INTERVAL = 200;

const mainMap = defineMapConfig({
  chunkSize: 48 * 48,
  tileWidth: TILE_WIDTH,
  tileHeight: TILE_HEIGHT,
  backgroundTile: [TerrainTileset.Blank],
  animationInterval: ANIMATION_INTERVAL,
  tileAnimations: {},
  layers: {
    layers: {
      Background: { tilesets: ["Default"] },
    },
    defaultLayer: "Background",
  },
});

export const phaserConfig = {
  sceneConfig: {
    [Scenes.Main]: defineSceneConfig({
      assets: {
        [Assets.TerrainTileset]: {
          type: AssetType.Image,
          key: Assets.TerrainTileset,
          path: terrainTilesetImage,
        },
        [Assets.MainAtlas]: {
          type: AssetType.MultiAtlas,
          key: Assets.MainAtlas,
          // Add a timestamp to the end of the path to prevent caching
          path: `/assets/atlases/atlas.json?timestamp=${Date.now()}`,
          options: {
            imagePath: "/assets/atlases/",
          },
        },
      },
      maps: {
        [Maps.Main]: mainMap,
      },
      sprites: {
        [Sprites.Avatar]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/avatars/0.png",
        },

        [Sprites.Heart]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/ui/heart/0.png",
        },
        [Sprites.StaminaDot]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/ui/stamina-dot/0.png",
        },
        [Sprites.BarFrame]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/ui/bar/frame/0.png",
        },
        [Sprites.HealthBarFill]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/ui/bar/health-fill/0.png",
        },
        [Sprites.StaminaBarFill]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/ui/bar/stamina-fill/0.png",
        },
        [Sprites.PendingStaminaBarFill]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/ui/bar/pending-stamina-fill/0.png",
        },

        // Weapons
        [Sprites.Sword]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/items/0.png",
        },
        [Sprites.Dagger]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/items/4.png",
        },
        [Sprites.Spear]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/items/26.png",
        },
        [Sprites.Hammer]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/items/14.png",
        },
        [Sprites.Axe]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/items/9.png",
        },
        [Sprites.Shield]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/items/43.png",
        },
        [Sprites.Bow]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/items/17.png",
        },
        [Sprites.BowLarge]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/items/18.png",
        },
        [Sprites.Staff]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/items/3.png",
        },
        [Sprites.DevilHorn]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/items/234.png",
        },
        [Sprites.DevilHornLarge]: {
          assetKey: Assets.MainAtlas,
          frame: "sprites/items/234.png",
        }
      },
      animations: [
        {
          key: Animations.Hero,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 1,
          frameRate: 2,
          repeat: -1,
          prefix: "sprites/heroes/sword/",
          suffix: ".png",
        },
        {
          key: Animations.SkeletonSword,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 1,
          frameRate: 2,
          repeat: -1,
          prefix: "sprites/monsters/skeletons/sword/",
          suffix: ".png",
        },
        {
          key: Animations.SkeletonBow,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 1,
          frameRate: 2,
          repeat: -1,
          prefix: "sprites/monsters/skeletons/bow/",
          suffix: ".png",
        },
        {
          key: Animations.Spawner,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 1,
          frameRate: 2,
          repeat: -1,
          prefix: "sprites/monsters/spawner/",
          suffix: ".png",
        },

        // UI
        {
          key: Animations.TileHighlight,
          assetKey: Assets.MainAtlas,
          startFrame: 0,
          endFrame: 2,
          frameRate: 3,
          repeat: -1,
          prefix: "sprites/ui/tile-highlight/",
          suffix: ".png",
        },
      ],
      tilesets: {
        Default: {
          assetKey: Assets.TerrainTileset,
          tileWidth: TILE_WIDTH,
          tileHeight: TILE_HEIGHT,
        },
      },
    }),
  },
  scale: defineScaleConfig({
    parent: "phaser-game",
    zoom: 1,
    mode: Phaser.Scale.NONE,
  }),
  cameraConfig: defineCameraConfig({
    pinchSpeed: 1,
    wheelSpeed: 1,
    maxZoom: 3,
    minZoom: 1,
  }),
  cullingChunkSize: TILE_HEIGHT * 16,
};
