/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IWorld, IWorldInterface } from "../IWorld";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "resource",
        type: "string",
      },
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
    ],
    name: "AccessDenied",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "functionSelector",
        type: "bytes4",
      },
    ],
    name: "FunctionSelectorExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "functionSelector",
        type: "bytes4",
      },
    ],
    name: "FunctionSelectorNotFound",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "resource",
        type: "string",
      },
    ],
    name: "InvalidSelector",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "module",
        type: "string",
      },
    ],
    name: "ModuleAlreadyInstalled",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "resource",
        type: "string",
      },
    ],
    name: "ResourceExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "resource",
        type: "string",
      },
    ],
    name: "ResourceNotFound",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "received",
        type: "uint256",
      },
    ],
    name: "StoreCore_DataIndexOverflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "received",
        type: "uint256",
      },
    ],
    name: "StoreCore_InvalidDataLength",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "received",
        type: "uint256",
      },
    ],
    name: "StoreCore_InvalidFieldNamesLength",
    type: "error",
  },
  {
    inputs: [],
    name: "StoreCore_NotDynamicField",
    type: "error",
  },
  {
    inputs: [],
    name: "StoreCore_NotImplemented",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tableId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tableIdString",
        type: "string",
      },
    ],
    name: "StoreCore_TableAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tableId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tableIdString",
        type: "string",
      },
    ],
    name: "StoreCore_TableNotFound",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "system",
        type: "address",
      },
    ],
    name: "SystemExists",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
    ],
    name: "StoreDeleteRecord",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "schemaIndex",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "StoreSetField",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "StoreSetRecord",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes16",
        name: "namespace",
        type: "bytes16",
      },
      {
        internalType: "bytes16",
        name: "file",
        type: "bytes16",
      },
      {
        internalType: "bytes",
        name: "funcSelectorAndArgs",
        type: "bytes",
      },
    ],
    name: "call",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
    ],
    name: "deleteRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes16",
        name: "namespace",
        type: "bytes16",
      },
      {
        internalType: "bytes16",
        name: "file",
        type: "bytes16",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
    ],
    name: "deleteRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
      {
        internalType: "uint8",
        name: "schemaIndex",
        type: "uint8",
      },
    ],
    name: "getField",
    outputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
    ],
    name: "getKeySchema",
    outputs: [
      {
        internalType: "Schema",
        name: "schema",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
      {
        internalType: "Schema",
        name: "schema",
        type: "bytes32",
      },
    ],
    name: "getRecord",
    outputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
    ],
    name: "getRecord",
    outputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
    ],
    name: "getSchema",
    outputs: [
      {
        internalType: "Schema",
        name: "schema",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes16",
        name: "namespace",
        type: "bytes16",
      },
      {
        internalType: "address",
        name: "grantee",
        type: "address",
      },
    ],
    name: "grantAccess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes16",
        name: "namespace",
        type: "bytes16",
      },
      {
        internalType: "bytes16",
        name: "file",
        type: "bytes16",
      },
      {
        internalType: "address",
        name: "grantee",
        type: "address",
      },
    ],
    name: "grantAccess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IModule",
        name: "module",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "args",
        type: "bytes",
      },
    ],
    name: "installModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IModule",
        name: "module",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "args",
        type: "bytes",
      },
    ],
    name: "installRootModule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isStore",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "item",
        type: "bytes32",
      },
      {
        internalType: "int32",
        name: "targetX",
        type: "int32",
      },
      {
        internalType: "int32",
        name: "targetY",
        type: "int32",
      },
    ],
    name: "mud_CombatSystem_attack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mud_CombatSystem_heal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "entity",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "item",
        type: "bytes32",
      },
    ],
    name: "mud_InventorySystem_unequip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "mud_ItemSystem_equipRandomItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "monster",
        type: "bytes32",
      },
    ],
    name: "mud_MonsterSystem_act",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int32[]",
        name: "xPath",
        type: "int32[]",
      },
      {
        internalType: "int32[]",
        name: "yPath",
        type: "int32[]",
      },
    ],
    name: "mud_MoveSystem_move",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int32",
        name: "x",
        type: "int32",
      },
      {
        internalType: "int32",
        name: "y",
        type: "int32",
      },
    ],
    name: "mud_MoveSystem_moveRoom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "id",
        type: "uint32",
      },
    ],
    name: "mud_PlayerSystem_spawn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int32",
        name: "roomX",
        type: "int32",
      },
      {
        internalType: "int32",
        name: "roomY",
        type: "int32",
      },
      {
        internalType: "int32",
        name: "x",
        type: "int32",
      },
      {
        internalType: "int32",
        name: "y",
        type: "int32",
      },
    ],
    name: "mud_SpawnerSystem_create",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "spawnerId",
        type: "bytes32",
      },
      {
        internalType: "int32",
        name: "x",
        type: "int32",
      },
      {
        internalType: "int32",
        name: "y",
        type: "int32",
      },
    ],
    name: "mud_SpawnerSystem_spawn",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
      {
        internalType: "uint8",
        name: "schemaIndex",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "dataToPush",
        type: "bytes",
      },
    ],
    name: "pushToField",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes16",
        name: "namespace",
        type: "bytes16",
      },
      {
        internalType: "bytes16",
        name: "file",
        type: "bytes16",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
      {
        internalType: "uint8",
        name: "schemaIndex",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "dataToPush",
        type: "bytes",
      },
    ],
    name: "pushToField",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        internalType: "Schema",
        name: "schema",
        type: "bytes32",
      },
      {
        internalType: "Schema",
        name: "keySchema",
        type: "bytes32",
      },
    ],
    name: "registerSchema",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        internalType: "contract IStoreHook",
        name: "hook",
        type: "address",
      },
    ],
    name: "registerStoreHook",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes16",
        name: "namespace",
        type: "bytes16",
      },
      {
        internalType: "bytes16",
        name: "file",
        type: "bytes16",
      },
      {
        internalType: "address",
        name: "grantee",
        type: "address",
      },
    ],
    name: "retractAccess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes16",
        name: "namespace",
        type: "bytes16",
      },
      {
        internalType: "bytes16",
        name: "file",
        type: "bytes16",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
      {
        internalType: "uint8",
        name: "schemaIndex",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "setField",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
      {
        internalType: "uint8",
        name: "schemaIndex",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "setField",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "tableName",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "fieldNames",
        type: "string[]",
      },
    ],
    name: "setMetadata",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes16",
        name: "namespace",
        type: "bytes16",
      },
      {
        internalType: "bytes16",
        name: "file",
        type: "bytes16",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "setRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "setRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "table",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
      {
        internalType: "uint8",
        name: "schemaIndex",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "startByteIndex",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "dataToSet",
        type: "bytes",
      },
    ],
    name: "updateInField",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes16",
        name: "namespace",
        type: "bytes16",
      },
      {
        internalType: "bytes16",
        name: "file",
        type: "bytes16",
      },
      {
        internalType: "bytes32[]",
        name: "key",
        type: "bytes32[]",
      },
      {
        internalType: "uint8",
        name: "schemaIndex",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "startByteIndex",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "dataToSet",
        type: "bytes",
      },
    ],
    name: "updateInField",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IWorld__factory {
  static readonly abi = _abi;
  static createInterface(): IWorldInterface {
    return new utils.Interface(_abi) as IWorldInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): IWorld {
    return new Contract(address, _abi, signerOrProvider) as IWorld;
  }
}
