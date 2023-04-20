// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";

import { LibInventory } from "../libraries/LibInventory.sol";

contract InventorySystem is System {
  function unequip(bytes32 entity, bytes32 item) public {
    LibInventory.unequip(entity, item);
  }
}
