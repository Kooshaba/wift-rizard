// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import { LibStamina } from "../libraries/LibStamina.sol";
import { LibPosition } from "../libraries/LibPosition.sol";

import { Player } from "../tables/Player.sol";
import { Health, HealthData } from "../tables/Health.sol";
import { Strength } from "../tables/Strength.sol";
import { Position, PositionData } from "../tables/Position.sol";
import { Monster } from "../tables/Monster.sol";

import { addressToEntity } from "../Utils.sol";

contract CombatSystem is System {
  function engage(bytes32 defender) public {
    bytes32 attacker = addressToEntity(_msgSender());

    LibStamina.spend(attacker, 20_000);

    require(Player.get(attacker) != 0, "Attacker must be a player");

    require(attacker != defender, "Attacker and defender must be different entities");
    require(Monster.get(defender), "Defender must be a monster");

    PositionData memory attackerPosition = Position.get(attacker);
    PositionData memory defenderPosition = Position.get(defender);
    require(LibPosition.manhattan(attackerPosition, defenderPosition) == 1, "Attacker and defender must be adjacent");

    int32 attackerDamage = Strength.get(attacker);
    int32 defenderDamage = Strength.get(defender);

    HealthData memory attackerHealth = Health.get(attacker);
    HealthData memory defenderHealth = Health.get(defender);

    if (attackerDamage >= defenderHealth.current) {
      Health.deleteRecord(defender);
      Monster.deleteRecord(defender);
      Position.deleteRecord(defender);

      // grow stronger after each kill
      Health.setMax(attacker, attackerHealth.max + 10);
      Strength.set(attacker, Strength.get(attacker) + 2);
    } else {
      Health.setCurrent(defender, defenderHealth.current - attackerDamage);

      if (defenderDamage >= attackerHealth.current) {
        Health.deleteRecord(attacker);
        Position.deleteRecord(attacker);
        Player.deleteRecord(attacker);
      } else {
        Health.setCurrent(attacker, attackerHealth.current - defenderDamage);
      }
    }
  }

  uint32 constant HEAL_AMOUNT = 20;

  function heal() public {
    bytes32 player = addressToEntity(_msgSender());
    require(Player.get(player) != 0, "must be a player");

    LibStamina.spend(player, 40_000);

    HealthData memory playerHealthData = Health.get(player);

    int32 newHealth = playerHealthData.current + int32(HEAL_AMOUNT);
    if (newHealth > playerHealthData.max) {
      newHealth = playerHealthData.max;
    }

    Health.set(player, HealthData(newHealth, playerHealthData.max));
  }
}
