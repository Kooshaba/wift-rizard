// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";
import { World } from "@latticexyz/world/src/World.sol";

import { LibFactory } from "../libraries/LibFactory.sol";

import { Player, PlayerTableId } from "../tables/Player.sol";
import { Health, HealthData } from "../tables/Health.sol";
import { Stamina, StaminaData } from "../tables/Stamina.sol";
import { EquippedBy } from "../tables/EquippedBy.sol";
import { MoveSpeed } from "../tables/MoveSpeed.sol";

import { Position } from "../tables/Position.sol";
import { Room } from "../tables/Room.sol";

import { addressToEntity } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

contract PlayerSystem is System {
  function spawn(uint32 id) public {
    bytes32 player = addressToEntity(_msgSender());

    require(id != 0, "Invalid player ID");

    uint32 existingId = Player.get(player);
    require(existingId == 0, "Address already spawned");

    bytes32[] memory conflictingPlayerIds = getKeysWithValue(PlayerTableId, Player.encode(id));
    require(conflictingPlayerIds.length == 0, "Player ID already exists");

    Player.set(player, id);
    Position.set(player, 4, 4);
    Room.set(player, 1, 1);
    Health.set(player, HealthData(100, 100));
    MoveSpeed.set(player, 2);
    Stamina.set(
      player,
      StaminaData({ current: 100_000, max: 100_000, regen: 10_000, lastRefreshedAt: block.timestamp })
    );

    bytes32 item = LibFactory.createSword();
    EquippedBy.set(item, player);

    item = LibFactory.createBow();
    EquippedBy.set(item, player);

    item = LibFactory.createSpear();
    EquippedBy.set(item, player);

    item = LibFactory.createDevilHornLarge();
    EquippedBy.set(item, player);
  }
}
