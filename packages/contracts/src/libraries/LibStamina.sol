// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Stamina, StaminaData } from "../tables/Stamina.sol";
import { BonusAttributes, BonusAttributesData } from "../tables/BonusAttributes.sol";

library LibStamina {
  function spend(bytes32 id, int32 amount) internal {
    StaminaData memory stamina = getCurrent(id);

    require(stamina.current >= amount, "Not enough stamina");

    stamina.current -= amount;
    Stamina.set(id, stamina);
  }

  function getCurrent(bytes32 id) internal returns (StaminaData memory) {
    refresh(id);

    return Stamina.get(id);
  }

  function refresh(bytes32 id) internal {
    StaminaData memory stamina = Stamina.get(id);
    uint256 currentTime = block.timestamp;
    uint256 timeSinceLastRefresh = currentTime - stamina.lastRefreshedAt;

    if(timeSinceLastRefresh <= 0) return;

    BonusAttributesData memory bonusAttributes = BonusAttributes.get(id);
    int32 regen = stamina.regen + bonusAttributes.staminaRegen;
    int32 max = stamina.max + bonusAttributes.staminaMax;

    stamina.current += regen * int32(uint32(timeSinceLastRefresh));
    stamina.lastRefreshedAt = currentTime;

    if (stamina.current > max) stamina.current = max;

    Stamina.set(id, stamina);
  }
}
