// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { Direction } from "../src/libraries/LibPosition.sol";
import { LibCombat } from "../src/libraries/LibCombat.sol";

import { Position, PositionData, PositionTableId } from "../src/tables/Position.sol";

import { IWorld } from "../src/world/IWorld.sol";

contract CombatTest is MudV2Test {
  IWorld world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testRotation() public {
    PositionData[] memory pattern = new PositionData[](3);
    pattern[0] = PositionData(-1, 0);
    pattern[1] = PositionData(0, -1);
    pattern[2] = PositionData(1, 0);

    PositionData[] memory output = LibCombat.rotateAttackPattern(pattern, Direction.Right);

    PositionData[] memory expectedPattern = new PositionData[](3);
    expectedPattern[0] = PositionData(0, 1);
    expectedPattern[1] = PositionData(1, 0);
    expectedPattern[2] = PositionData(0, -1);

    assertEq(output[0].x, expectedPattern[0].x, "first coord x");
    assertEq(output[0].y, expectedPattern[0].y, "first coord y");
    assertEq(output[1].x, expectedPattern[1].x, "second coord x");
    assertEq(output[1].y, expectedPattern[1].y, "second coord y");
    assertEq(output[2].x, expectedPattern[2].x, "third coord x");
    assertEq(output[2].y, expectedPattern[2].y, "third coord y");

    output = LibCombat.rotateAttackPattern(pattern, Direction.Down);

    expectedPattern = new PositionData[](3);
    expectedPattern[0] = PositionData(1, 0);
    expectedPattern[1] = PositionData(0, 1);
    expectedPattern[2] = PositionData(-1, 0);

    assertEq(output[0].x, expectedPattern[0].x, "first coord x");
    assertEq(output[0].y, expectedPattern[0].y, "first coord y");
    assertEq(output[1].x, expectedPattern[1].x, "second coord x");
    assertEq(output[1].y, expectedPattern[1].y, "second coord y");
    assertEq(output[2].x, expectedPattern[2].x, "third coord x");
    assertEq(output[2].y, expectedPattern[2].y, "third coord y");

    output = LibCombat.rotateAttackPattern(pattern, Direction.Left);

    expectedPattern = new PositionData[](3);
    expectedPattern[0] = PositionData(0, -1);
    expectedPattern[1] = PositionData(-1, 0);
    expectedPattern[2] = PositionData(0, 1);

    assertEq(output[0].x, expectedPattern[0].x, "first coord x");
    assertEq(output[0].y, expectedPattern[0].y, "first coord y");
    assertEq(output[1].x, expectedPattern[1].x, "second coord x");
    assertEq(output[1].y, expectedPattern[1].y, "second coord y");
    assertEq(output[2].x, expectedPattern[2].x, "third coord x");
    assertEq(output[2].y, expectedPattern[2].y, "third coord y");
  }
}
