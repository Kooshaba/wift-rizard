import { Coord } from "@latticexyz/phaserx";
import {
  EntityID,
  EntityIndex,
  defineSystem,
  runQuery,
  Has,
  getComponentValue,
  UpdateType,
  getComponentValueStrict,
  HasValue,
  Not,
} from "@latticexyz/recs";
import { NetworkLayer } from "./createNetworkLayer";
import { BigNumber, ContractTransaction } from "ethers";
import { ROOM_HEIGHT, ROOM_WIDTH } from "./types";
import { shuffle } from "lodash";

export function createNetworkUtils(layer: Omit<NetworkLayer, "utils">) {
  const {
    world,
    actions,
    worldSend,
    components: {
      Player,
      Position,
      Stamina,
      Room,
      Spawner,
      MonsterType,
      OptimisticStamina,
    },
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

  async function spawnPlayer(): Promise<ContractTransaction> {
    const allPlayers = [...runQuery([Has(Player)])];
    const nextPlayerId =
      Math.max(
        ...allPlayers.map(
          (player) => getComponentValueStrict(Player, player).value
        ),
        0
      ) + 1;

    const tx = await worldSend("mud_PlayerSystem_spawn", [
      nextPlayerId,
      { gasLimit: 2_000_000 },
    ]);

    return tx;
  }

  function move(coord: Coord) {
    actions.add({
      id: ("move" + Math.random().toPrecision(5)) as EntityID,
      updates: () => [],
      components: {},
      requirement: () => true,
      execute: async () => {
        return await worldSend("mud_MoveSystem_move", [
          coord.x,
          coord.y,
          {
            gasLimit: 1000000,
          },
        ]);
      },
    });
  }

  function moveRoom(coord: Coord) {
    actions.add({
      id: ("moveRoom" + Math.random().toPrecision(5)) as EntityID,
      updates: () => [],
      components: {},
      requirement: () => true,
      execute: async () => {
      return await worldSend("mud_MoveSystem_moveRoom", [
          coord.x,
          coord.y,
          {
            gasLimit: 1000000,
          },
        ]);
      },
    });
  }

  function attack(item: EntityIndex, target: Coord) {
    const itemId = world.entities[item];

    actions.add({
      id: ("attack" + Math.random().toPrecision(5)) as EntityID,
      updates: () => [],
      components: {},
      requirement: () => true,
      execute: async () => {
        const tx = await worldSend("mud_CombatSystem_attack", [
          itemId,
          target.x,
          target.y,
          {
            gasLimit: 1_000_000,
          },
        ]);

        return tx;
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

  function createSpawner() {
    const roomWithPlayer = [...runQuery([Has(Player), Has(Room)])][0];
    if (!roomWithPlayer) return;

    const room = getComponentValueStrict(Room, roomWithPlayer);
    const x = Phaser.Math.RND.integerInRange(0, ROOM_WIDTH - 1);
    const y = Phaser.Math.RND.integerInRange(0, ROOM_HEIGHT - 1);

    actions.add({
      id: ("createSpawner" + Math.random().toPrecision(5)) as EntityID,
      updates: () => [],
      components: {},
      requirement: () => true,
      execute: async () => {
        return await worldSend("mud_SpawnerSystem_create", [
          room.x,
          room.y,
          x,
          y,
          {
            gasLimit: 1_000_000,
          },
        ]);
      },
    });
  }

  function spawnMonster() {
    const spawners = [...runQuery([Has(Spawner), Has(Position)])];
    if (spawners.length === 0) return;

    const spawner = spawners.find((spawner) => {
      const stamina = getComponentValue(OptimisticStamina, spawner);
      if (!stamina) return false;

      return stamina.current >= stamina.max;
    });
    if (!spawner) return;

    const spawnerPosition = getComponentValueStrict(Position, spawner);
    const freePositionAroundSpawner = shuffle([
      { x: spawnerPosition.x - 1, y: spawnerPosition.y },
      { x: spawnerPosition.x + 1, y: spawnerPosition.y },
      { x: spawnerPosition.x, y: spawnerPosition.y - 1 },
      { x: spawnerPosition.x, y: spawnerPosition.y + 1 },
    ]).find((position) => {
      if (position.x < 0 || position.y < 0) return false;
      if (position.x >= ROOM_WIDTH || position.y >= ROOM_HEIGHT) return false;

      const entitiesAtPosition = [...runQuery([HasValue(Position, position)])];
      return entitiesAtPosition.length === 0;
    });

    if (!freePositionAroundSpawner) return;

    actions.add({
      id: ("spawnMonster" + Math.random().toPrecision(5)) as EntityID,
      updates: () => [],
      components: {},
      requirement: () => true,
      execute: async () => {
        return worldSend("mud_SpawnerSystem_spawn", [
          world.entities[spawner],
          freePositionAroundSpawner.x,
          freePositionAroundSpawner.y,
          {
            gasLimit: 2_000_000,
          },
        ]);
      },
    });
  }

  function tickRoom(roomCoord: Coord) {
    const monsters = [
      ...runQuery([
        Has(MonsterType),
        Has(Position),
        HasValue(Room, { x: roomCoord.x, y: roomCoord.y }),
        Not(Spawner),
      ]),
    ];
    if (monsters.length === 0) return;

    const monster = shuffle(monsters).find((m) => {
      const stamina = getComponentValue(OptimisticStamina, m);
      if (!stamina) return false;

      return stamina.current >= stamina.max;
    });
    if (!monster) return;

    tickMonster(monster);
  }

  function tickMonster(monster: EntityIndex) {
    actions.add({
      id: ("tickMonster" + Math.random().toPrecision(5)) as EntityID,
      updates: () => [],
      components: {},
      requirement: () => true,
      execute: async () => {
        return await worldSend("mud_MonsterSystem_act", [
          world.entities[monster],
          {
            gasLimit: 5_000_000,
          },
        ]);
      },
    });
  }

  function getCurrentStamina(entity: EntityIndex): number {
    const stamina = getComponentValue(Stamina, entity);
    if (!stamina) return 0;

    const currentTime = BigNumber.from(Math.floor(Date.now() / 1000));
    const secondsSinceLastRefresh = currentTime
      .sub(stamina.lastRefreshedAt)
      .toNumber();

    const newCurrent =
      secondsSinceLastRefresh * stamina.regen + stamina.current;
    return Math.min(newCurrent, stamina.max);
  }

  return {
    onPlayerLoaded,
    getCurrentStamina,

    txApi: {
      spawnPlayer,
      move,
      moveRoom,
      attack,
      heal,

      createSpawner,
      spawnMonster,
      tickRoom,
      tickMonster,
    },
  };
}
