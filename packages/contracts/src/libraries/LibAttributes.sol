// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Attribute, AttributeData } from "../tables/Attribute.sol";
import { AttributeTypes } from "../Types.sol";

import { getUniqueEntityId } from "../Utils.sol";

library LibAttributes {
  function createAttributes() internal pure returns (AttributeData[] memory) {
    AttributeData[] memory attributes = new AttributeData[](20);
    attributes[0] = AttributeData({
      healthMax: 25,
      strength: 0,
      staminaCost: 0,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Fortitude
    });
    attributes[1] = AttributeData({
      healthMax: 0,
      strength: 2,
      staminaCost: 0,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Strong
    });
    attributes[2] = AttributeData({
      healthMax: 0,
      strength: 0,
      staminaCost: -5000,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Lightweight
    });
    attributes[3] = AttributeData({
      healthMax: 0,
      strength: 0,
      staminaCost: 0,
      staminaRegen: 1000,
      moveSpeed: 0,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Alacrity
    });
    attributes[4] = AttributeData({
      healthMax: 0,
      strength: 0,
      staminaCost: 0,
      staminaRegen: 0,
      moveSpeed: 1,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Swift
    });
    attributes[5] = AttributeData({
      healthMax: 0,
      strength: 0,
      staminaCost: 0,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 10,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Enchanted
    });
    attributes[6] = AttributeData({
      healthMax: 50,
      strength: 0,
      staminaCost: 0,
      staminaRegen: -1000,
      moveSpeed: 0,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Sentinel
    });
    attributes[7] = AttributeData({
      healthMax: 0,
      strength: 5,
      staminaCost: 5000,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Heavy
    });
    attributes[8] = AttributeData({
      healthMax: -25,
      strength: 0,
      staminaCost: -10000,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Featherweight
    });
    attributes[9] = AttributeData({
      healthMax: 0,
      strength: 0,
      staminaCost: 0,
      staminaRegen: 1000,
      moveSpeed: -1,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Stiff
    });
    attributes[10] = AttributeData({
      healthMax: 0,
      strength: 0,
      staminaCost: 0,
      staminaRegen: 0,
      moveSpeed: 2,
      heal: -10,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Untouchable
    });
    attributes[11] = AttributeData({
      healthMax: 0,
      strength: -2,
      staminaCost: 0,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 20,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Sustainable
    });
    attributes[12] = AttributeData({
      healthMax: 10,
      strength: 0,
      staminaCost: 0,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 5,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Wellmade
    });
    attributes[13] = AttributeData({
      healthMax: 0,
      strength: 2,
      staminaCost: 5000,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 0,
      rangeMin: 0,
      rangeMax: 1,
      attributeType: AttributeTypes.Long
    });
    attributes[14] = AttributeData({
      healthMax: 0,
      strength: -2,
      staminaCost: -5000,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 0,
      rangeMin: -1,
      rangeMax: 0,
      attributeType: AttributeTypes.Short
    });
    attributes[15] = AttributeData({
      healthMax: 0,
      strength: 2,
      staminaCost: -5000,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Spiked
    });
    attributes[16] = AttributeData({
      healthMax: 0,
      strength: 2,
      staminaCost: -5000,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Sharp
    });
    attributes[17] = AttributeData({
      healthMax: 0,
      strength: -2,
      staminaCost: -5000,
      staminaRegen: 0,
      moveSpeed: 1,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Mythril
    });
    attributes[18] = AttributeData({
      healthMax: 0,
      strength: 5,
      staminaCost: -5000,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 0,
      rangeMin: 0,
      rangeMax: -1,
      attributeType: AttributeTypes.Battle
    });
    attributes[19] = AttributeData({
      healthMax: 0,
      strength: -1,
      staminaCost: -10000,
      staminaRegen: 0,
      moveSpeed: 0,
      heal: 0,
      rangeMin: 0,
      rangeMax: 0,
      attributeType: AttributeTypes.Dualwield
    });
    return attributes;
  }

  function getRandomAttribute(uint256 seed) internal returns (bytes32) {
    AttributeData[] memory attributes = createAttributes();

    uint256 attributeSeed = seed % attributes.length;
    AttributeData memory randomAttribute = attributes[attributeSeed];
    bytes32 id = getUniqueEntityId();

    Attribute.set(id, randomAttribute);

    return id;
  }
}
