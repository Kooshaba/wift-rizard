import { PhaserLayer } from "../createPhaserLayer";

import { createCamera } from "./createCamera";
import { createPlayerSystem } from "./createPlayerSystem";
import { createPositionSystem } from "./createPositionSystem";
import { createMapSystem } from "./createMapSystem";
import { createMonsterSystem } from "./createMonsterSystem";
import { createMessagesSystem } from "./createMessagesSystem";
import { createClientStaminaSystem } from "./createClientStaminaSystem";
import { createTargetingSystem } from "./createTargetingSystem";
import { createDamageSystem } from "./createDamageSystem";
import { drawMonsterBars } from "./drawMonsterBars";
import { createDrawMonsterPathSystem } from "./createDrawMonsterPathSystem";
import { setActiveRoom } from "./setActiveRoom";
import { createWorldMapSystem } from "./createWorldMapSystem";
import { playerMovement } from "./playerMovement";

export const registerSystems = (layer: PhaserLayer) => {
  createCamera(layer);
  createPlayerSystem(layer);
  createMonsterSystem(layer);
  createPositionSystem(layer);
  createMapSystem(layer);
  createMessagesSystem(layer);
  createClientStaminaSystem(layer);
  createTargetingSystem(layer);
  createDamageSystem(layer);
  drawMonsterBars(layer);
  setActiveRoom(layer);
  createWorldMapSystem(layer);
  createDrawMonsterPathSystem(layer);
  playerMovement(layer);
};