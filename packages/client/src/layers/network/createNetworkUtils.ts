import { Coord } from "@latticexyz/phaserx";
import {
  defineSystem,
  runQuery,
  Has,
  getComponentValue,
  UpdateType,
  getComponentValueStrict,
  HasValue,
  Not,
  getEntitiesWithValue,
  Entity,
} from "@latticexyz/recs";
import { NetworkLayer } from "./createNetworkLayer";
import { BigNumber, ContractTransaction } from "ethers";
import {
  AttributeTypeNameData,
  AttributeTypes,
  ItemTypeNames,
  ItemTypes,
  NameTypes,
  ROOM_HEIGHT,
  ROOM_WIDTH,
} from "./types";
import { shuffle } from "lodash";

export function createNetworkUtils(layer: Omit<NetworkLayer, "utils">) {
  const {
    worldSend,
    components: {
      Player,
      Position,
      Stamina,
      Room,
      Spawner,
      MonsterType,
      OptimisticStamina,
      BonusAttributes,
      ItemType,
      Attribute,
      OnItem,
    },
  } = layer;

  const entityToBytes32 = (entity: Entity) => {
    return "0x" + entity.replace("0x", "").padStart(64, "0");
  };

  /**
   * @param callback Called once a Player and all of their Components are loaded into the game.
   */
  function onPlayerLoaded(
    callback: (
      data: {
        player: Entity;
        playerNumber: number;
      } | null
    ) => void
  ) {
    const {
      world,
      components: { Player },
      playerEntity,
    } = layer;

    let playerLoaded = false;

    defineSystem(world, [Has(Player)], ({ type, entity }) => {
      if (playerLoaded) return;
      if (entity !== playerEntity) return;
      if (!playerEntity) return;

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

    const tx = await worldSend("mud_PlayerSystem_spawn", [nextPlayerId]);

    return tx;
  }

  function move(path: Coord[]) {
    worldSend("mud_MoveSystem_move", [
      path.map((coord) => coord.x),
      path.map((coord) => coord.y),
    ]);
  }

  function moveRoom(coord: Coord) {
    worldSend("mud_MoveSystem_moveRoom", [
      coord.x,
      coord.y,
      {
        gasLimit: 1000000,
      },
    ]);
  }

  function attack(item: Entity, target: Coord) {
    worldSend("mud_CombatSystem_attack", [
      entityToBytes32(item),
      target.x,
      target.y,
      {
        gasLimit: 1_000_000,
      },
    ]);
  }

  function heal() {
    worldSend("mud_CombatSystem_heal", [
      {
        gasLimit: 1000000,
      },
    ]);
  }

  function equipRandomItem() {
    worldSend("mud_ItemSystem_equipRandomItem", []);
  }

  function unequip(item: Entity) {
    worldSend("mud_InventorySystem_unequip", [entityToBytes32(item)]);
  }

  function createSpawner() {
    const roomWithPlayer = [...runQuery([Has(Player), Has(Room)])][0];
    if (!roomWithPlayer) return;

    const room = getComponentValueStrict(Room, roomWithPlayer);
    const x = Phaser.Math.RND.integerInRange(0, ROOM_WIDTH - 1);
    const y = Phaser.Math.RND.integerInRange(0, ROOM_HEIGHT - 1);

    worldSend("mud_SpawnerSystem_create", [
      room.x,
      room.y,
      x,
      y,
      {
        gasLimit: 1_000_000,
      },
    ]);
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

    worldSend("mud_SpawnerSystem_spawn", [
      entityToBytes32(spawner),
      freePositionAroundSpawner.x,
      freePositionAroundSpawner.y,
      {
        gasLimit: 2_000_000,
      },
    ]);
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

  function tickMonster(monster: Entity) {
    worldSend("mud_MonsterSystem_act", [
      entityToBytes32(monster),
      {
        gasLimit: 5_000_000,
      },
    ]);
  }

  function getCurrentStamina(entity: Entity): number {
    const stamina = getComponentValue(Stamina, entity);
    if (!stamina) return 0;

    const currentTime = BigNumber.from(Math.floor(Date.now() / 1000));
    const secondsSinceLastRefresh = currentTime
      .sub(stamina.lastRefreshedAt)
      .toNumber();

    const bonusAttributes = getComponentValue(BonusAttributes, entity);
    const regen = stamina.regen + (bonusAttributes?.staminaRegen ?? 0);
    const max = stamina.max;

    const newCurrent = secondsSinceLastRefresh * regen + stamina.current;
    return Math.min(newCurrent, max);
  }

  function isValidPosition(position: Coord) {
    if (
      position.x < 0 ||
      position.x >= ROOM_WIDTH ||
      position.y < 0 ||
      position.y >= ROOM_HEIGHT
    ) {
      return false;
    }

    const blockingEntities = getEntitiesWithValue(Position, position);
    if (blockingEntities.size > 0) return false;

    return true;
  }

  function getItemName(entity: Entity): string {
    const itemType = getComponentValue(ItemType, entity)?.value;
    if (!itemType) return "Unknown";

    let name = ItemTypeNames[itemType as ItemTypes];

    const attributes = [...runQuery([HasValue(OnItem, { value: entity })])];
    for (const attr of attributes) {
      const attribute = getComponentValueStrict(Attribute, attr);
      const nameData =
        AttributeTypeNameData[attribute.attributeType as AttributeTypes];

      name =
        nameData.type === NameTypes.Prefix
          ? `${nameData.value}${name}`
          : `${name}${nameData.value}`;
    }

    return name;
  }

  return {
    onPlayerLoaded,
    getCurrentStamina,
    isValidPosition,
    getItemName,

    txApi: {
      spawnPlayer,
      move,
      moveRoom,
      attack,
      heal,
      equipRandomItem,
      unequip,

      createSpawner,
      spawnMonster,
      tickRoom,
      tickMonster,
    },
  };
}
