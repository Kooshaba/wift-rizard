import { defineSystem, UpdateType, Has, isComponentUpdate } from "@latticexyz/recs";
import { store } from "../../../store";
import { PhaserLayer } from "../createPhaserLayer";

export function createMessagesSystem(layer: PhaserLayer) {
  const { networkLayer: {
    world,
    playerEntity,
    components: {
      Player,
      Health
    }
  } } = layer;

    defineSystem(world, [Has(Player), Has(Health)], (update) => {
      if(update.type === UpdateType.Exit) return;
      if(!isComponentUpdate(update, Health)) return;

      const { entity, value } = update;
      if(entity !== playerEntity) return;

      const [currentHealth, previousHealth] = value;

      store.setState({
        messages: [
          ...store.getState().messages,
          {
            message: `Health changed from ${previousHealth?.current} to ${currentHealth?.current}`,
            color: "pink"
          }
        ]
      })
    });
}