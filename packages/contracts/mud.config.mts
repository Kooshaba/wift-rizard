import { mudConfig, resolveTableId } from "@latticexyz/cli";

export default mudConfig({
  deploysDirectory: "./deploys",
  excludeSystems: ["System3", "System2"],
  worldContractName: "CustomWorld",
  namespace: "mud",
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
    EquippedBy: {
      fileSelector: "equippedBy",
      schema: {
        value: "bytes32",
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
  ],
});
