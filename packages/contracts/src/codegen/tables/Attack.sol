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

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16("mud"), bytes16("Attack")));
bytes32 constant AttackTableId = _tableId;

struct AttackData {
  int32 strength;
  int32 staminaCost;
  int32 minRange;
  int32 maxRange;
  int32[] patternX;
  int32[] patternY;
}

library Attack {
  /** Get the table's schema */
  function getSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](6);
    _schema[0] = SchemaType.INT32;
    _schema[1] = SchemaType.INT32;
    _schema[2] = SchemaType.INT32;
    _schema[3] = SchemaType.INT32;
    _schema[4] = SchemaType.INT32_ARRAY;
    _schema[5] = SchemaType.INT32_ARRAY;

    return SchemaLib.encode(_schema);
  }

  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](1);
    _schema[0] = SchemaType.BYTES32;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's metadata */
  function getMetadata() internal pure returns (string memory, string[] memory) {
    string[] memory _fieldNames = new string[](6);
    _fieldNames[0] = "strength";
    _fieldNames[1] = "staminaCost";
    _fieldNames[2] = "minRange";
    _fieldNames[3] = "maxRange";
    _fieldNames[4] = "patternX";
    _fieldNames[5] = "patternY";
    return ("Attack", _fieldNames);
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

  /** Get strength */
  function getStrength(bytes32 key) internal view returns (int32 strength) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Get strength (using the specified store) */
  function getStrength(IStore _store, bytes32 key) internal view returns (int32 strength) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Set strength */
  function setStrength(bytes32 key, int32 strength) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 0, abi.encodePacked((strength)));
  }

  /** Set strength (using the specified store) */
  function setStrength(IStore _store, bytes32 key, int32 strength) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 0, abi.encodePacked((strength)));
  }

  /** Get staminaCost */
  function getStaminaCost(bytes32 key) internal view returns (int32 staminaCost) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Get staminaCost (using the specified store) */
  function getStaminaCost(IStore _store, bytes32 key) internal view returns (int32 staminaCost) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Set staminaCost */
  function setStaminaCost(bytes32 key, int32 staminaCost) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 1, abi.encodePacked((staminaCost)));
  }

  /** Set staminaCost (using the specified store) */
  function setStaminaCost(IStore _store, bytes32 key, int32 staminaCost) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 1, abi.encodePacked((staminaCost)));
  }

  /** Get minRange */
  function getMinRange(bytes32 key) internal view returns (int32 minRange) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 2);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Get minRange (using the specified store) */
  function getMinRange(IStore _store, bytes32 key) internal view returns (int32 minRange) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 2);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Set minRange */
  function setMinRange(bytes32 key, int32 minRange) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 2, abi.encodePacked((minRange)));
  }

  /** Set minRange (using the specified store) */
  function setMinRange(IStore _store, bytes32 key, int32 minRange) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 2, abi.encodePacked((minRange)));
  }

  /** Get maxRange */
  function getMaxRange(bytes32 key) internal view returns (int32 maxRange) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 3);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Get maxRange (using the specified store) */
  function getMaxRange(IStore _store, bytes32 key) internal view returns (int32 maxRange) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 3);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Set maxRange */
  function setMaxRange(bytes32 key, int32 maxRange) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 3, abi.encodePacked((maxRange)));
  }

  /** Set maxRange (using the specified store) */
  function setMaxRange(IStore _store, bytes32 key, int32 maxRange) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 3, abi.encodePacked((maxRange)));
  }

  /** Get patternX */
  function getPatternX(bytes32 key) internal view returns (int32[] memory patternX) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 4);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_int32());
  }

  /** Get patternX (using the specified store) */
  function getPatternX(IStore _store, bytes32 key) internal view returns (int32[] memory patternX) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 4);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_int32());
  }

  /** Set patternX */
  function setPatternX(bytes32 key, int32[] memory patternX) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 4, EncodeArray.encode((patternX)));
  }

  /** Set patternX (using the specified store) */
  function setPatternX(IStore _store, bytes32 key, int32[] memory patternX) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 4, EncodeArray.encode((patternX)));
  }

  /** Get the length of patternX */
  function lengthPatternX(bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    uint256 _byteLength = StoreSwitch.getFieldLength(_tableId, _keyTuple, 4, getSchema());
    return _byteLength / 4;
  }

  /** Get the length of patternX (using the specified store) */
  function lengthPatternX(IStore _store, bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    uint256 _byteLength = _store.getFieldLength(_tableId, _keyTuple, 4, getSchema());
    return _byteLength / 4;
  }

  /** Get an item of patternX (unchecked, returns invalid data if index overflows) */
  function getItemPatternX(bytes32 key, uint256 _index) internal view returns (int32) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getFieldSlice(_tableId, _keyTuple, 4, getSchema(), _index * 4, (_index + 1) * 4);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Get an item of patternX (using the specified store) (unchecked, returns invalid data if index overflows) */
  function getItemPatternX(IStore _store, bytes32 key, uint256 _index) internal view returns (int32) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getFieldSlice(_tableId, _keyTuple, 4, getSchema(), _index * 4, (_index + 1) * 4);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Push an element to patternX */
  function pushPatternX(bytes32 key, int32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.pushToField(_tableId, _keyTuple, 4, abi.encodePacked((_element)));
  }

  /** Push an element to patternX (using the specified store) */
  function pushPatternX(IStore _store, bytes32 key, int32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.pushToField(_tableId, _keyTuple, 4, abi.encodePacked((_element)));
  }

  /** Pop an element from patternX */
  function popPatternX(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.popFromField(_tableId, _keyTuple, 4, 4);
  }

  /** Pop an element from patternX (using the specified store) */
  function popPatternX(IStore _store, bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.popFromField(_tableId, _keyTuple, 4, 4);
  }

  /** Update an element of patternX at `_index` */
  function updatePatternX(bytes32 key, uint256 _index, int32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.updateInField(_tableId, _keyTuple, 4, _index * 4, abi.encodePacked((_element)));
  }

  /** Update an element of patternX (using the specified store) at `_index` */
  function updatePatternX(IStore _store, bytes32 key, uint256 _index, int32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.updateInField(_tableId, _keyTuple, 4, _index * 4, abi.encodePacked((_element)));
  }

  /** Get patternY */
  function getPatternY(bytes32 key) internal view returns (int32[] memory patternY) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 5);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_int32());
  }

  /** Get patternY (using the specified store) */
  function getPatternY(IStore _store, bytes32 key) internal view returns (int32[] memory patternY) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 5);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_int32());
  }

  /** Set patternY */
  function setPatternY(bytes32 key, int32[] memory patternY) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setField(_tableId, _keyTuple, 5, EncodeArray.encode((patternY)));
  }

  /** Set patternY (using the specified store) */
  function setPatternY(IStore _store, bytes32 key, int32[] memory patternY) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setField(_tableId, _keyTuple, 5, EncodeArray.encode((patternY)));
  }

  /** Get the length of patternY */
  function lengthPatternY(bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    uint256 _byteLength = StoreSwitch.getFieldLength(_tableId, _keyTuple, 5, getSchema());
    return _byteLength / 4;
  }

  /** Get the length of patternY (using the specified store) */
  function lengthPatternY(IStore _store, bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    uint256 _byteLength = _store.getFieldLength(_tableId, _keyTuple, 5, getSchema());
    return _byteLength / 4;
  }

  /** Get an item of patternY (unchecked, returns invalid data if index overflows) */
  function getItemPatternY(bytes32 key, uint256 _index) internal view returns (int32) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getFieldSlice(_tableId, _keyTuple, 5, getSchema(), _index * 4, (_index + 1) * 4);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Get an item of patternY (using the specified store) (unchecked, returns invalid data if index overflows) */
  function getItemPatternY(IStore _store, bytes32 key, uint256 _index) internal view returns (int32) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getFieldSlice(_tableId, _keyTuple, 5, getSchema(), _index * 4, (_index + 1) * 4);
    return (int32(uint32(Bytes.slice4(_blob, 0))));
  }

  /** Push an element to patternY */
  function pushPatternY(bytes32 key, int32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.pushToField(_tableId, _keyTuple, 5, abi.encodePacked((_element)));
  }

  /** Push an element to patternY (using the specified store) */
  function pushPatternY(IStore _store, bytes32 key, int32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.pushToField(_tableId, _keyTuple, 5, abi.encodePacked((_element)));
  }

  /** Pop an element from patternY */
  function popPatternY(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.popFromField(_tableId, _keyTuple, 5, 4);
  }

  /** Pop an element from patternY (using the specified store) */
  function popPatternY(IStore _store, bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.popFromField(_tableId, _keyTuple, 5, 4);
  }

  /** Update an element of patternY at `_index` */
  function updatePatternY(bytes32 key, uint256 _index, int32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.updateInField(_tableId, _keyTuple, 5, _index * 4, abi.encodePacked((_element)));
  }

  /** Update an element of patternY (using the specified store) at `_index` */
  function updatePatternY(IStore _store, bytes32 key, uint256 _index, int32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.updateInField(_tableId, _keyTuple, 5, _index * 4, abi.encodePacked((_element)));
  }

  /** Get the full data */
  function get(bytes32 key) internal view returns (AttackData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(IStore _store, bytes32 key) internal view returns (AttackData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(
    bytes32 key,
    int32 strength,
    int32 staminaCost,
    int32 minRange,
    int32 maxRange,
    int32[] memory patternX,
    int32[] memory patternY
  ) internal {
    bytes memory _data = encode(strength, staminaCost, minRange, maxRange, patternX, patternY);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    StoreSwitch.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using individual values (using the specified store) */
  function set(
    IStore _store,
    bytes32 key,
    int32 strength,
    int32 staminaCost,
    int32 minRange,
    int32 maxRange,
    int32[] memory patternX,
    int32[] memory patternY
  ) internal {
    bytes memory _data = encode(strength, staminaCost, minRange, maxRange, patternX, patternY);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32((key));

    _store.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using the data struct */
  function set(bytes32 key, AttackData memory _table) internal {
    set(key, _table.strength, _table.staminaCost, _table.minRange, _table.maxRange, _table.patternX, _table.patternY);
  }

  /** Set the full data using the data struct (using the specified store) */
  function set(IStore _store, bytes32 key, AttackData memory _table) internal {
    set(
      _store,
      key,
      _table.strength,
      _table.staminaCost,
      _table.minRange,
      _table.maxRange,
      _table.patternX,
      _table.patternY
    );
  }

  /** Decode the tightly packed blob using this table's schema */
  function decode(bytes memory _blob) internal view returns (AttackData memory _table) {
    // 16 is the total byte length of static data
    PackedCounter _encodedLengths = PackedCounter.wrap(Bytes.slice32(_blob, 16));

    _table.strength = (int32(uint32(Bytes.slice4(_blob, 0))));

    _table.staminaCost = (int32(uint32(Bytes.slice4(_blob, 4))));

    _table.minRange = (int32(uint32(Bytes.slice4(_blob, 8))));

    _table.maxRange = (int32(uint32(Bytes.slice4(_blob, 12))));

    // Store trims the blob if dynamic fields are all empty
    if (_blob.length > 16) {
      uint256 _start;
      // skip static data length + dynamic lengths word
      uint256 _end = 48;

      _start = _end;
      _end += _encodedLengths.atIndex(0);
      _table.patternX = (SliceLib.getSubslice(_blob, _start, _end).decodeArray_int32());

      _start = _end;
      _end += _encodedLengths.atIndex(1);
      _table.patternY = (SliceLib.getSubslice(_blob, _start, _end).decodeArray_int32());
    }
  }

  /** Tightly pack full data using this table's schema */
  function encode(
    int32 strength,
    int32 staminaCost,
    int32 minRange,
    int32 maxRange,
    int32[] memory patternX,
    int32[] memory patternY
  ) internal view returns (bytes memory) {
    uint40[] memory _counters = new uint40[](2);
    _counters[0] = uint40(patternX.length * 4);
    _counters[1] = uint40(patternY.length * 4);
    PackedCounter _encodedLengths = PackedCounterLib.pack(_counters);

    return
      abi.encodePacked(
        strength,
        staminaCost,
        minRange,
        maxRange,
        _encodedLengths.unwrap(),
        EncodeArray.encode((patternX)),
        EncodeArray.encode((patternY))
      );
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
