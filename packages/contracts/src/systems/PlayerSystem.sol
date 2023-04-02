// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { World } from "@latticexyz/world/src/World.sol";

import { LibFactory } from "../libraries/LibFactory.sol";

import { Player, PlayerTableId } from "../tables/Player.sol";
import { Position, PositionTableId } from "../tables/Position.sol";
import { Health, HealthData } from "../tables/Health.sol";
import { Stamina, StaminaData } from "../tables/Stamina.sol";
import { EquippedBy } from "../tables/EquippedBy.sol";

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
    Stamina.set(
      player,
      StaminaData({ current: 100_000, max: 100_000, regen: 100_000, lastRefreshedAt: block.timestamp })
    );

    bytes32 item = LibFactory.createAxe();
    EquippedBy.set(item, player);

    item = LibFactory.createShield();
    EquippedBy.set(item, player);

    item = LibFactory.createSword();
    EquippedBy.set(item, player);

    item = LibFactory.createBow();
    EquippedBy.set(item, player);

    item = LibFactory.createBowLarge();
    EquippedBy.set(item, player);

    item = LibFactory.createDagger();
    EquippedBy.set(item, player);

    item = LibFactory.createSpear();
    EquippedBy.set(item, player);

    item = LibFactory.createHammer();
    EquippedBy.set(item, player);

    item = LibFactory.createDevilHorn();
    EquippedBy.set(item, player);

    item = LibFactory.createDevilHornLarge();
    EquippedBy.set(item, player);
  }
}
