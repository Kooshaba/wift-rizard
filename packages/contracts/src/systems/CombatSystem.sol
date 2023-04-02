// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";

import { LibStamina } from "../libraries/LibStamina.sol";
import { LibPosition, Direction } from "../libraries/LibPosition.sol";
import { LibCombat } from "../libraries/LibCombat.sol";

import { Player } from "../tables/Player.sol";
import { Health, HealthData } from "../tables/Health.sol";
import { Position, PositionData, PositionTableId } from "../tables/Position.sol";
import { Monster } from "../tables/Monster.sol";
import { Attack, AttackData } from "../tables/Attack.sol";
import { EquippedBy } from "../tables/EquippedBy.sol";

import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import { addressToEntity } from "../Utils.sol";

contract CombatSystem is System {
  function attack(bytes32 item, int32 targetX, int32 targetY) public {
    bytes32 attacker = addressToEntity(_msgSender());
    AttackData memory attackData = Attack.get(item);

    LibStamina.spend(attacker, attackData.staminaCost);

    require(Player.get(attacker) != 0, "Attacker must be a player");
    require(EquippedBy.get(item) == attacker, "Item must be equipped by attacker");

    PositionData memory attackerPosition = Position.get(attacker);
    PositionData memory targetPosition = PositionData(targetX, targetY);
    int32 distance = LibPosition.manhattan(attackerPosition, targetPosition);

    require(
      distance <= attackData.maxRange && distance >= attackData.minRange,
      "Attacker and defender must be adjacent"
    );

    Direction direction = LibPosition.getDirection(attackerPosition, targetPosition);

    PositionData[] memory pattern = new PositionData[](attackData.patternX.length);
    for (uint256 i = 0; i < attackData.patternX.length; i++) {
      pattern[i] = PositionData(attackData.patternX[i], attackData.patternY[i]);
    }

    pattern = LibCombat.rotateAttackPattern(pattern, direction);

    for (uint256 i = 0; i < pattern.length; i++) {
      pattern[i].x += targetX;
      pattern[i].y += targetY;
    }

    // find enemies in pattern
    for (uint256 i = 0; i < pattern.length; i++) {
      bytes32[] memory enemyIds = getKeysWithValue(PositionTableId, Position.encode(pattern[i].x, pattern[i].y));
      for (uint256 j = 0; j < enemyIds.length; j++) {
        bytes32 enemy = enemyIds[j];
        if (!Monster.get(enemy)) continue;

        int32 damage = attackData.strength;
        HealthData memory defenderHealth = Health.get(enemy);

        if (damage >= defenderHealth.current) {
          Health.deleteRecord(enemy);
          Monster.deleteRecord(enemy);
          Position.deleteRecord(enemy);
        } else {
          Health.setCurrent(enemy, defenderHealth.current - damage);
        }
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
