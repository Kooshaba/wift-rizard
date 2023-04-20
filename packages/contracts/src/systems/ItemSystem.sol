// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { System } from "@latticexyz/world/src/System.sol";

import { LibItemGenerator } from "../libraries/LibItemGenerator.sol";
import { LibInventory } from "../libraries/LibInventory.sol";

import { addressToEntity } from "../Utils.sol";

contract ItemSystem is System {
  // TODO this is only here for dev, need to figure out how to equip items in a real flow
  function equipRandomItem() public {
    bytes32 item = LibItemGenerator.generate(uint256(blockhash(block.number - 1)));
    LibInventory.equip(addressToEntity(_msgSender()), item);
  }
}
