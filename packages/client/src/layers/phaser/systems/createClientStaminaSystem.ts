import { PhaserLayer } from "../createPhaserLayer";
import { Has, defineSystem, runQuery } from "@latticexyz/recs";

export function createClientStaminaSystem(layer: PhaserLayer) {
  const {
    world,
    networkLayer: {
      components: { Stamina, OptimisticStamina },
      network: {
        clock: {
          time$
        }
      },
      utils: {
        getCurrentStamina,
      }
    }
  } = layer;

  time$.subscribe(() => {
    const entities = runQuery([Has(Stamina)]);
    entities.forEach(entity => {
      OptimisticStamina.addOverride(entity.toString(), {
        entity,
        value: {
          current: getCurrentStamina(entity),
        }
      })
    });
  });

  defineSystem(world, [Has(Stamina)], ({entity}) => {
    OptimisticStamina.removeOverride(entity.toString());
  });
}