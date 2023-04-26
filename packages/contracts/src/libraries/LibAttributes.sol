// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Attribute, AttributeData } from "../tables/Attribute.sol";
import { AttributeTypes } from "../Types.sol";

import { getUniqueEntityId } from "../Utils.sol";

library LibAttributes {
  function createGodlike() internal returns (bytes32) {
    bytes32 id = getUniqueEntityId();

    Attribute.set(
      id,
      AttributeData({
        attributeType: AttributeTypes.Godlike,
        healthMax: 100,
        strength: 25,
        staminaMax: 100_000,
        staminaRegen: 10_000,
        staminaCost: -20_000,
        moveSpeed: 1,
        heal: 10,
        rangeMin: 0,
        rangeMax: 1
      })
    );

    return id;
  }

  function createFortitude() internal returns (bytes32) {
    bytes32 id = getUniqueEntityId();

    Attribute.set(
      id,
      AttributeData({
        attributeType: AttributeTypes.Fortitude,
        healthMax: 25,
        strength: 0,
        staminaMax: 0,
        staminaRegen: 0,
        staminaCost: 0,
        moveSpeed: 0,
        heal: 0,
        rangeMin: 0,
        rangeMax: 0
      })
    );

    return id;
  }

  function createStrong() internal returns (bytes32) {
    bytes32 id = getUniqueEntityId();

    Attribute.set(
      id,
      AttributeData({
        attributeType: AttributeTypes.Strong,
        healthMax: 0,
        strength: 2,
        staminaMax: 0,
        staminaRegen: 0,
        staminaCost: 0,
        moveSpeed: 0,
        heal: 0,
        rangeMin: 0,
        rangeMax: 0
      })
    );

    return id;
  }

  function createLightweight() internal returns (bytes32) {
    bytes32 id = getUniqueEntityId();

    Attribute.set(
      id,
      AttributeData({
        attributeType: AttributeTypes.Lightweight,
        healthMax: 0,
        strength: 0,
        staminaMax: 0,
        staminaRegen: 0,
        staminaCost: -5_000,
        moveSpeed: 0,
        heal: 0,
        rangeMin: 0,
        rangeMax: 0
      })
    );

    return id;
  }

  function createAlacrity() internal returns (bytes32) {
    bytes32 id = getUniqueEntityId();

    Attribute.set(
      id,
      AttributeData({
        attributeType: AttributeTypes.Alacrity,
        healthMax: 0,
        strength: 0,
        staminaMax: 0,
        staminaRegen: 1_000,
        staminaCost: 0,
        moveSpeed: 0,
        heal: 0,
        rangeMin: 0,
        rangeMax: 0
      })
    );

    return id;
  }

  function createSwift() internal returns (bytes32) {
    bytes32 id = getUniqueEntityId();

    Attribute.set(
      id,
      AttributeData({
        attributeType: AttributeTypes.Swift,
        healthMax: 0,
        strength: 0,
        staminaMax: 0,
        staminaRegen: 0,
        staminaCost: 0,
        moveSpeed: 1,
        heal: 0,
        rangeMin: 0,
        rangeMax: 0
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
    } else if (attributeSeed == 3) {
      return createAlacrity();
    } else {
      return createSwift();
    }
  }
}
