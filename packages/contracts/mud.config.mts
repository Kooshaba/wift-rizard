import { mudConfig, resolveTableId } from "@latticexyz/world/register";

export default mudConfig({
  deploysDirectory: "./deploys",
  worldContractName: "CustomWorld",
  namespace: "mud",
  enums: {
    AttributeTypes: [
      "None",
      "Fortitude",
      "Strong",
      "Lightweight",
      "Alacrity",
      "Swift",
      "Enchanted",
      "Sentinel",
      "Heavy",
      "Featherweight",
      "Stiff",
      "Untouchable",
      "Sustainable",
      "Wellmade",
      "Long",
      "Short",
      "Spiked",
      "Sharp",
      "Mythril",
      "Battle",
      "Dualwield",
    ],
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
      schema: {
        value: "uint32",
      },
    },
    Room: {
      schema: {
        x: "int32",
        y: "int32",
      },
    },
    Position: {
      schema: {
        x: "int32",
        y: "int32",
      },
    },
    Health: {
      schema: {
        current: "int32",
        max: "int32",
      },
    },
    MoveSpeed: {
      schema: {
        value: "int32",
      },
    },
    Stamina: {
      schema: {
        current: "int32",
        max: "int32",
        regen: "int32",
        lastRefreshedAt: "uint256",
      },
    },
    ItemType: {
      schema: {
        value: "uint32",
      },
    },
    Attack: {
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
      schema: {
        equipSize: "uint32",
        size: "uint32",
      },
    },
    /**
     * Attribute (OnItem) -> Item (EquippedBy) -> Player
     */
    EquippedBy: {
      schema: {
        value: "bytes32",
      },
    },
    InInventoryOf: {
      schema: {
        value: "bytes32",
      },
    },
    Attribute: {
      schema: {
        attributeType: "AttributeTypes",
        healthMax: "int32",
        strength: "int32",
        staminaRegen: "int32",
        staminaCost: "int32",
        moveSpeed: "int32",
        heal: "int32",
        rangeMin: "int32",
        rangeMax: "int32",
      },
    },
    OnItem: {
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
      schema: {
        healthMax: "int32",
        strength: "int32",
        staminaRegen: "int32",
        staminaCost: "int32",
        moveSpeed: "int32",
        heal: "int32",
        rangeMin: "int32",
        rangeMax: "int32",
      },
    },

    MonsterType: {
      schema: {
        value: "uint32",
      },
    },
    Spawner: {
      schema: {
        value: "bool",
      },
    },
    Nonce: {
      schema: {
        value: "uint256",
      },
    },
    RngCommit: {
      schema: {
        blockNumber: "uint256",
      },
    },

    // CombatResult: {
    //   schema: {
    //     attacker: "bytes32",
    //     defender: "bytes32",
    //     damage: "int32",
    //   },
    //   ephemeral: true,
    // }
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
      args: [resolveTableId("EquippedBy")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("OnItem")],
    },
  ],
});
