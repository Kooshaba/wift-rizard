// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16("mud"), bytes16("Stamina")));
bytes32 constant StaminaTableId = _tableId;

struct StaminaData {
  int32 current;
  int32 max;
  int32 regen;
  uint256 lastRefreshedAt;
}

library Stamina {
  /** Get the table's schema */
  function getSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](4);
    _schema[0] = SchemaType.INT32;
    _schema[1] = SchemaType.INT32;
    _schema[2] = SchemaType.INT32;
    _schema[3] = SchemaType.UINT256;

    return SchemaLib.encode(_schema);
  }

  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](1);
    _schema[0] = SchemaType.BYTES32;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's metadata */
  function getMetadata() internal pure returns (string memory, string[] memory) {
    string[] memory _fieldNames = new string[](4);
    _fieldNames[0] = "current";
    _fieldNames[1] = "max";
    _fieldNames[2] = "regen";
    _fieldNames[3] = "lastRefreshedAt";
    return ("Stamina", _fieldNames);
  }

  /** Register the table's schema */
  function registerSchema() internal {
    StoreSwitch.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Register the table's schema (using the specified store) */
  function registerSchema(IStore _store) internal {
    _store.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Set the table's metadata */
  function setMetadata() internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    StoreSwitch.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Set the table's metadata (using the specified store) */
  function setMetadata(IStore _store) internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    _store.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Get current */
  function getCurrent(bytes32 key) internal view returns (int32 current) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Get current (using the specified store) */
  function getCurrent(IStore _store, bytes32 key) internal view returns (int32 current) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Set current */
  function setCurrent(bytes32 key, int32 current) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 0, abi.encodePacked((current)));
  }

  /** Set current (using the specified store) */
  function setCurrent(IStore _store, bytes32 key, int32 current) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 0, abi.encodePacked((current)));
  }

  /** Get max */
  function getMax(bytes32 key) internal view returns (int32 max) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Get max (using the specified store) */
  function getMax(IStore _store, bytes32 key) internal view returns (int32 max) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Set max */
  function setMax(bytes32 key, int32 max) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 1, abi.encodePacked((max)));
  }

  /** Set max (using the specified store) */
  function setMax(IStore _store, bytes32 key, int32 max) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 1, abi.encodePacked((max)));
  }

  /** Get regen */
  function getRegen(bytes32 key) internal view returns (int32 regen) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 2);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Get regen (using the specified store) */
  function getRegen(IStore _store, bytes32 key) internal view returns (int32 regen) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 2);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Set regen */
  function setRegen(bytes32 key, int32 regen) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 2, abi.encodePacked((regen)));
  }

  /** Set regen (using the specified store) */
  function setRegen(IStore _store, bytes32 key, int32 regen) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 2, abi.encodePacked((regen)));
  }

  /** Get lastRefreshedAt */
  function getLastRefreshedAt(bytes32 key) internal view returns (uint256 lastRefreshedAt) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 3);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Get lastRefreshedAt (using the specified store) */
  function getLastRefreshedAt(IStore _store, bytes32 key) internal view returns (uint256 lastRefreshedAt) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 3);
    return (uint256(Bytes.slice32(_blob, 0)));
  }

  /** Set lastRefreshedAt */
  function setLastRefreshedAt(bytes32 key, uint256 lastRefreshedAt) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 3, abi.encodePacked((lastRefreshedAt)));
  }

  /** Set lastRefreshedAt (using the specified store) */
  function setLastRefreshedAt(IStore _store, bytes32 key, uint256 lastRefreshedAt) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 3, abi.encodePacked((lastRefreshedAt)));
  }

  /** Get the full data */
  function get(bytes32 key) internal view returns (StaminaData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(IStore _store, bytes32 key) internal view returns (StaminaData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(bytes32 key, int32 current, int32 max, int32 regen, uint256 lastRefreshedAt) internal {
    bytes memory _data = encode(current, max, regen, lastRefreshedAt);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using individual values (using the specified store) */
  function set(IStore _store, bytes32 key, int32 current, int32 max, int32 regen, uint256 lastRefreshedAt) internal {
    bytes memory _data = encode(current, max, regen, lastRefreshedAt);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using the data struct */
  function set(bytes32 key, StaminaData memory _table) internal {
    set(key, _table.current, _table.max, _table.regen, _table.lastRefreshedAt);
  }

  /** Set the full data using the data struct (using the specified store) */
  function set(IStore _store, bytes32 key, StaminaData memory _table) internal {
    set(_store, key, _table.current, _table.max, _table.regen, _table.lastRefreshedAt);
  }

  /** Decode the tightly packed blob using this table's schema */
  function decode(bytes memory _blob) internal pure returns (StaminaData memory _table) {
    _table.current = (int32(uint32(Bytes.slice4(_blob, 0))));

    _table.max = (int32(uint32(Bytes.slice4(_blob, 4))));

    _table.regen = (int32(uint32(Bytes.slice4(_blob, 8))));

    _table.lastRefreshedAt = (uint256(Bytes.slice32(_blob, 12)));
  }

  /** Tightly pack full data using this table's schema */
  function encode(int32 current, int32 max, int32 regen, uint256 lastRefreshedAt) internal view returns (bytes memory) {
    return abi.encodePacked(current, max, regen, lastRefreshedAt);
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple(bytes32 key) internal pure returns (bytes32[] memory _keyTuple) {
    _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));
  }

  /* Delete all data for given keys */
  function deleteRecord(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.deleteRecord(_tableId, _keyTuple);
  }
}
