// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Attribute, AttributeData } from "../tables/Attribute.sol";

import { getUniqueEntityId } from "../Utils.sol";

library LibAttributes {
  function createGodlike() internal returns (bytes32) {
    return createAttribute(100, 25, 100, 10, -20_000, 0, 0, 0, 1);
  }

  function createFortitude() internal returns (bytes32) {
    return createAttribute(25, 0, 0, 0, 0, 0, 0, 0, 0);
  }

  function createStrong() internal returns (bytes32) {
    return createAttribute(0, 2, 0, 0, 0, 0, 0, 0, 0);
  }

  function createLightweight() internal returns (bytes32) {
    return createAttribute(0, 0, 0, 0, -5, 0, 0, 0, 0);
  }

  function createAlacrity() internal returns (bytes32) {
    return createAttribute(0, 0, 0, 1, 0, 0, 0, 0, 0);
  }

  function createSwift() internal returns (bytes32) {
    return createAttribute(0, 0, 0, 0, 0, 1, 0, 0, 0);
  }

  function createAttribute(
    int32 healthMax,
    int32 strength,
    int32 staminaMax,
    int32 staminaRegen,
    int32 staminaCost,
    int32 moveSpeed,
    int32 heal,
    int32 rangeMin,
    int32 rangeMax
  ) internal returns (bytes32) {
    bytes32 id = getUniqueEntityId();

    Attribute.set(
      id,
      AttributeData({
        healthMax: healthMax,
        strength: strength,
        staminaMax: staminaMax,
        staminaRegen: staminaRegen,
        staminaCost: staminaCost,
        moveSpeed: moveSpeed,
        heal: heal,
        rangeMin: rangeMin,
        rangeMax: rangeMax
      })
    );

    return id;
  }

  function getRandomAttribute(uint256 seed) internal returns (bytes32) {
    uint256 attributeSeed = seed % 5;

    if (attributeSeed == 0) {
      return createFortitude();
    } else if (attributeSeed == 1) {
      return createStrong();
    } else if (attributeSeed == 2) {
      return createLightweight();
    } else if (attributeSeed == 3){
      return createAlacrity();
    } else {
      return createSwift();
    }
  }
}
