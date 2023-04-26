// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { LibItemFactory } from "./LibItemFactory.sol";
import { LibAttributes } from "./LibAttributes.sol";

import { ItemTypes } from "../Types.sol";

import { ItemType } from "../tables/ItemType.sol";
import { Attack, AttackData } from "../tables/Attack.sol";
import { OnItem } from "../tables/OnItem.sol";

library LibItemGenerator {
  function generate(uint256 seed) internal returns (bytes32) {
    bytes32 item = LibItemFactory.getRandomItem(seed);

    bytes32 attribute = LibAttributes.getRandomAttribute(seed);
    OnItem.set(attribute, item);

    return item;
  }
}
