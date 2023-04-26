// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";

import { LibInventory } from "../libraries/LibInventory.sol";

import { addressToEntity } from "../Utils.sol";

contract InventorySystem is System {
  function unequip(bytes32 item) public {
    bytes32 player = addressToEntity(_msgSender());

    LibInventory.unequip(player, item);
  }
}
