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
    Monster: {
      fileSelector: "monster",
      schema: {
        value: "bool"
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
    Strength: {
      fileSelector: "strength",
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
    }
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
  ],
});
