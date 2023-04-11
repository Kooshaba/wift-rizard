// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

import { LibMonster } from "../src/libraries/LibMonster.sol";

import { RoomData } from "../src/tables/Room.sol";
import { Position, PositionData } from "../src/tables/Position.sol";
import { Stamina, StaminaData } from "../src/tables/Stamina.sol";

import { IWorld } from "../src/world/IWorld.sol";

contract MonsterTest is MudV2Test {
  IWorld world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testMonsterTickMove() public {
    uint32 playerNumber = 1;
    world.mud_PlayerSystem_spawn(playerNumber);

    bytes32 skeleton = LibMonster.spawnSkeleton(RoomData(1, 1), PositionData(3, 3));
    // Stamina.setCurrent(skeleton, 25_000);

    // world.mud_MonsterSystem_act(skeleton);

    // PositionData memory position = Position.get(skeleton);
    // assertEq(position.x, 4, "skeleton x");
    // assertEq(position.y, 3, "skeleton y");
  }
}
