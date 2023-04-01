import { Coord } from "@latticexyz/phaserx";
import {
  EntityID,
  EntityIndex,
  defineSystem,
  runQuery,
  Has,
  HasValue,
  getComponentValue,
  UpdateType,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { NetworkLayer } from "./createNetworkLayer";
import { BigNumber } from "ethers";

export function createNetworkUtils(layer: Omit<NetworkLayer, "utils">) {
  const {
    world,
    actions,
    worldSend,
    components: { Player, Position, Stamina },
  } = layer;

  /**
   * @param callback Called once a Player and all of their Components are loaded into the game.
   */
  function onPlayerLoaded(
    callback: (
      data: {
        player: EntityIndex;
        playerId: EntityID;
        playerNumber: number;
      } | null
    ) => void
  ) {
    const {
      world,
      components: { Player },
      playerEntity,
      playerEntityId,
    } = layer;

    let playerLoaded = false;

    defineSystem(world, [Has(Player)], ({ type, entity }) => {
      if (playerLoaded) return;
      if (entity !== playerEntity) return;
      if (!playerEntity || !playerEntityId) return;

      if (type === UpdateType.Exit) {
        playerLoaded = false;
        callback(null);
        return;
      }

      const playerNumber = getComponentValue(Player, playerEntity);
      if (!playerNumber) return;

      playerLoaded = true;
      callback({
        player: playerEntity,
        playerId: playerEntityId,
        playerNumber: playerNumber.value,
      });
    });
  }

  function spawnPlayer() {
    const getRandomCoord = () => {
      return {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
      };
    };

    const findPosition = () => {
      let x: number;
      let y: number;
      let blockingEntities: Set<EntityIndex>;

      do {
        const randomCoord = getRandomCoord();
        x = randomCoord.x;
        y = randomCoord.y;

        blockingEntities = runQuery([HasValue(Position, randomCoord)]);
      } while (blockingEntities.size > 0);

      return { x, y };
    };

    const allPlayers = [...runQuery([Has(Player)])];
    const nextPlayerId =
      Math.max(
        ...allPlayers.map(
          (player) => getComponentValueStrict(Player, player).value
        ),
        0
      ) + 1;

    actions.add({
      id: ("spawnPlayer" + Math.random().toPrecision(5)) as EntityID,
      updates: () => [],
      components: {},
      requirement: () => true,
      execute: async () => {
        const { x, y } = findPosition();

        return worldSend("mud_PlayerSystem_spawn", [
          nextPlayerId,
          x,
          y,
          {
            gasLimit: 1_000_000,
          },
        ]);
      },
    });
  }

  function move(coord: Coord) {
    actions.add({
      id: ("move" + Math.random().toPrecision(5)) as EntityID,
      updates: () => [],
      components: {},
      requirement: () => true,
      execute: async () => {
        return worldSend("mud_MoveSystem_move", [
          coord.x,
          coord.y,
          {
            gasLimit: 1000000,
          },
        ]);
      },
    });
  }

  function attack(monster: EntityIndex) {
    actions.add({
      id: ("attack" + Math.random().toPrecision(5)) as EntityID,
      updates: () => [],
      components: {},
      requirement: () => true,
      execute: async () => {
        const monsterId = world.entities[monster];

        return worldSend("mud_CombatSystem_engage", [
          monsterId,
          {
            gasLimit: 1000000,
          },
        ]);
      },
    });
  }

  function heal() {
    actions.add({
      id: ("heal" + Math.random().toPrecision(5)) as EntityID,
      updates: () => [],
      components: {},
      requirement: () => true,
      execute: async () => {
        return worldSend("mud_CombatSystem_heal", [
          {
            gasLimit: 1000000,
          },
        ]);
      },
    });
  }

  function getCurrentStamina(entity: EntityIndex): number {
    const stamina = getComponentValue(Stamina, entity);
    if (!stamina) return 0;

    const currentTime = BigNumber.from(Math.floor(Date.now() / 1000));
    const secondsSinceLastRefresh = currentTime.sub(stamina.lastRefreshedAt).toNumber();

    const newCurrent = secondsSinceLastRefresh * stamina.regen + stamina.current;
    return Math.min(newCurrent, stamina.max);
  }

  return {
    onPlayerLoaded,
    getCurrentStamina,

    txApi: {
      spawnPlayer,
      move,
      attack,
      heal,
    },
  };
}
