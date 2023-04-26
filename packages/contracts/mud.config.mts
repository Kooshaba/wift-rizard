import { mudConfig, resolveTableId } from "@latticexyz/cli";

export default mudConfig({
  deploysDirectory: "./deploys",
  excludeSystems: ["System3", "System2"],
  worldContractName: "CustomWorld",
  namespace: "mud",
  enums: {
    AttributeTypes: ["None", "Fortitude", "Strong", "Lightweight", "Alacrity", "Swift", "Godlike"],
    ItemTypes: [
      "None",
      "Sword",
      "Dagger",
      "Spear",
      "Hammer",
      "Axe",
      "Shield",
      "Bow",
      "BowLarge",
      "Staff",
      "DevilHorn",
      "DevilHornLarge",
    ],
    MonsterTypes: ["None", "Spawner", "Skeleton", "SkeletonArcher", "Spider"],
  },
  tables: {
    Player: {
      fileSelector: "player",
      schema: {
        value: "uint32",
      },
    },
    Room: {
      fileSelector: "room",
      schema: {
        x: "int32",
        y: "int32",
      },
    },
    Position: {
      fileSelector: "position",
      schema: {
        x: "int32",
        y: "int32",
      },
    },
    Health: {
      fileSelector: "health",
      schema: {
        current: "int32",
        max: "int32",
      },
    },
    MoveSpeed: {
      fileSelector: "moveSpeed",
      schema: {
        value: "int32",
      },
    },
    Stamina: {
      fileSelector: "stamina",
      schema: {
        current: "int32",
        max: "int32",
        regen: "int32",
        lastRefreshedAt: "uint256",
      },
    },
    ItemType: {
      fileSelector: "itemType",
      schema: {
        value: "uint32",
      },
    },
    Attack: {
      fileSelector: "attack",
      schema: {
        strength: "int32",
        staminaCost: "int32",
        minRange: "int32",
        maxRange: "int32",
        patternX: "int32[]",
        patternY: "int32[]",
      },
    },
    Inventory: {
      fileSelector: "inventory",
      schema: {
        equipSize: "uint32",
        size: "uint32",
      },
    },
    /**
     * Attribute (OnItem) -> Item (EquippedBy) -> Player
     */
    EquippedBy: {
      fileSelector: "equippedBy",
      schema: {
        value: "bytes32",
      },
    },
    InInventoryOf: {
      fileSelector: "inInventoryOf",
      schema: {
        value: "bytes32",
      },
    },
    Attribute: {
      fileSelector: "attribute",
      schema: {
        attributeType: "AttributeTypes",
        healthMax: "int32",
        strength: "int32",
        staminaMax: "int32",
        staminaRegen: "int32",
        staminaCost: "int32",
        moveSpeed: "int32",
        heal: "int32",
        rangeMin: "int32",
        rangeMax: "int32",
      },
    },
    OnItem: {
      fileSelector: "onItem",
      schema: {
        value: "bytes32",
      },
    },

    /**
     * Calculated and stored every time a player
     * equips / unequips and item.
     * Used to prevent expensive queries when calculating
     * attributes during actions.
     */
    BonusAttributes: {
      fileSelector: "bonusAttributes",
      schema: {
        healthMax: "int32",
        strength: "int32",
        staminaMax: "int32",
        staminaRegen: "int32",
        staminaCost: "int32",
        moveSpeed: "int32",
        heal: "int32",
        rangeMin: "int32",
        rangeMax: "int32",
      },
    },

    MonsterType: {
      fileSelector: "monster",
      schema: {
        value: "uint32",
      },
    },
    Spawner: {
      fileSelector: "spawner",
      schema: {
        value: "bool",
      },
    },
    Nonce: {
      fileSelector: "nonce",
      schema: {
        value: "uint256",
      },
    },
    RngCommit: {
      fileSelector: "rngCommit",
      schema: {
        blockNumber: "uint256",
      },
    },
  },
  modules: [
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("Player")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("Position")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("Room")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("Room")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("EquippedBy")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("OnItem")],
    },
  ],
});
