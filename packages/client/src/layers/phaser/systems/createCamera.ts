import { Has, HasValue, UpdateType, defineSystem } from "@latticexyz/recs";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { PhaserLayer } from "../createPhaserLayer";

export const createCamera = (layer: PhaserLayer) => {
  const {
    world,
    scenes: {
      Main: {
        objectPool,
        camera: { phaserCamera },
      },
    },
    networkLayer: {
      utils: { onPlayerLoaded },
      components: { Player, Position },
    },
    components: { InActiveRoom },
  } = layer;

  phaserCamera.centerOn(0, 0);
  phaserCamera.setZoom(3);

  onPlayerLoaded((playerData) => {
    if (!playerData) {
      return;
    }

    const { player, playerNumber } = playerData;
    defineSystem(
      world,
      [
        HasValue(Player, { value: playerNumber }),
        Has(Position),
        Has(InActiveRoom),
      ],
      ({ type }) => {
        if (type === UpdateType.Exit) {
          phaserCamera.stopFollow();
          return;
        }

        const playerObj = objectPool.get(player, "Sprite");
        playerObj.setComponent({
          id: "CameraFollow",
          once: (playerSprite) => {
            phaserCamera.startFollow(
              playerSprite,
              true,
              0.4,
              0.4,
              -(TILE_WIDTH / 2),
              -(TILE_HEIGHT / 2)
            );
          },
        });
      }
    );
  });
};
