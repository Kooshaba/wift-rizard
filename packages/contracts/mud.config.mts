import { mudConfig, resolveTableId } from "@latticexyz/cli";

export default mudConfig({
  deploysDirectory: "./deploys",
  excludeSystems: ["System3", "System2"],
  worldContractName: "CustomWorld",
  namespace: "mud",
  tables: {
    PlayerTable: {
      fileSelector: "player",
      schema: {
        value: "uint32",
      },
    },
    MonsterTable: {
      fileSelector: "monster",
      schema: {
        value: "bool"
      },
    },
    PositionTable: {
      fileSelector: "position",
      schema: {
        x: "int32",
        y: "int32",
      },
    },
    HealthTable: {
      fileSelector: "health",
      schema: {
        current: "int32",
        max: "int32",
      },
    },
    StrengthTable: {
      fileSelector: "strength",
      schema: {
        value: "int32",
      },
    },
  },
  modules: [
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("PlayerTable")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("PositionTable")],
    },
  ],
});
