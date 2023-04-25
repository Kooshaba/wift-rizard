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
    world.mud_ItemSystem_equipRandomItem();

    int32[] memory xPath = new int32[](2);
    int32[] memory yPath = new int32[](2);

    xPath[0] = 5;
    yPath[0] = 4;

    xPath[1] = 5;
    yPath[1] = 5;

    world.mud_MoveSystem_move(xPath, yPath);
  }
}
