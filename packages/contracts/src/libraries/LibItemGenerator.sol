// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { LibItemFactory } from "./LibItemFactory.sol";
import { LibAttributes } from "./LibAttributes.sol";

import { ItemTypes } from "../Types.sol";

import { ItemType } from "../tables/ItemType.sol";
import { Attack, AttackData } from "../tables/Attack.sol";
import { OnItem } from "../tables/OnItem.sol";

library LibItemGenerator {
  function generateSword() internal returns (bytes32) {
    bytes32 sword = LibItemFactory.createSword();

    bytes32 attribute = LibAttributes.createGodlike();
    OnItem.set(attribute, sword);

    return sword;
  }
}
