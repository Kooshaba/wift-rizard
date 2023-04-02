import { Has, UpdateType, defineSystem, getComponentValue } from "@latticexyz/recs";
import { PhaserLayer } from "../createPhaserLayer";
import { TILE_HEIGHT, TILE_WIDTH } from "../constants";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";

export function drawMonsterBars(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      components: { OptimisticStamina, MonsterType, Position, Health },
    },
    scenes: {
      Main: {
        objectPool,
      },
    },
  } = layer;

  defineSystem(world, [Has(Health), Has(MonsterType), Has(Position)], ({ type, entity }) => {
    if(type === UpdateType.Exit) {
      objectPool.remove(`health-${entity}`);
      return;
    }

    const health = getComponentValue(Health, entity);
    if(!health) return;

    const position = getComponentValue(Position, entity);
    if(!position) return;

    const currentHealthPercentage = health.current / health.max;
    const pixelCoord = tileCoordToPixelCoord(position, TILE_WIDTH, TILE_HEIGHT);

    const staminaObj = objectPool.get(`health-${entity}`, "Rectangle");
    staminaObj.setComponent({
      id: "bar",
      once: rect => {
        rect.setSize((TILE_WIDTH - 2) * currentHealthPercentage, 1);
        rect.setFillStyle(0x00ff0F);
        rect.setPosition(pixelCoord.x + 1, pixelCoord.y);
      }
    });
  });

  defineSystem(world, [Has(OptimisticStamina), Has(MonsterType), Has(Position)], ({ type, entity }) => {
    if(type === UpdateType.Exit) {
      objectPool.remove(`stamina-${entity}`);
      return;
    }

    const stamina = getComponentValue(OptimisticStamina, entity);
    if(!stamina) return;

    const position = getComponentValue(Position, entity);
    if(!position) return;

    const currentStaminaPercentage = stamina.current / stamina.max;
    const pixelCoord = tileCoordToPixelCoord(position, TILE_WIDTH, TILE_HEIGHT);

    const staminaObj = objectPool.get(`stamina-${entity}`, "Rectangle");
    staminaObj.setComponent({
      id: "bar",
      once: rect => {
        rect.setSize((TILE_WIDTH - 2) * currentStaminaPercentage, 1);
        rect.setFillStyle(0xffff00);
        rect.setPosition(pixelCoord.x + 1, pixelCoord.y + 1);
      }
    });
  });
}