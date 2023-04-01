// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { World } from "@latticexyz/world/src/World.sol";

import { Player, PlayerTableId } from "../tables/Player.sol";
import { Position, PositionTableId } from "../tables/Position.sol";
import { Health, HealthData } from "../tables/Health.sol";
import { Strength } from "../tables/Strength.sol";
import { Stamina, StaminaData } from "../tables/Stamina.sol";

import { addressToEntity } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

contract PlayerSystem is System {
  function spawn(uint32 id, int32 x, int32 y) public {
    bytes32 player = addressToEntity(_msgSender());

    require(id != 0, "Invalid player ID");

    uint32 existingId = Player.get(player);
    require(existingId == 0, "Address already spawned");

    bytes32[] memory conflictingPlayerIds = getKeysWithValue(PlayerTableId, Player.encode(id));
    require(conflictingPlayerIds.length == 0, "Player ID already exists");

    bytes32[] memory conflictingPositions = getKeysWithValue(PositionTableId, Position.encode(x, y));
    require(conflictingPositions.length == 0, "Position already occupied");

    Player.set(player, id);
    Position.set(player, x, y);
    Health.set(player, HealthData(100, 100));
    Strength.set(player, 10);
    Stamina.set(player, StaminaData({
      current: 100_000,
      max: 100_000,
      regen: 2_000,
      lastRefreshedAt: block.timestamp
    }));
  }
}
