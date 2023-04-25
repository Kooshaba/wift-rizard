// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { LibStamina } from "../libraries/LibStamina.sol";

import { Inventory } from "../tables/Inventory.sol";
import { OnItem, OnItemTableId } from "../tables/OnItem.sol";
import { EquippedBy, EquippedByTableId } from "../tables/EquippedBy.sol";

import { Attribute, AttributeData, AttributeTableId } from "../tables/Attribute.sol";
import { BonusAttributes, BonusAttributesData } from "../tables/BonusAttributes.sol";

import { getUniqueEntityId } from "../Utils.sol";
import { getKeysWithValue } from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

library LibInventory {
  function equip(bytes32 entity, bytes32 item) internal {
    LibStamina.spend(entity, 10_000);

    require(Inventory.getEquipSize(entity) > 0, "Entity has no inventory");

    uint32 freeSlots = getFreeEquipSlots(entity);
    require(freeSlots > 0, "Entity has no free equip slots");

    EquippedBy.set(item, entity);

    AttributeData[] memory attributeData = getItemAttributeData(item);
    BonusAttributesData memory playerAttributes = BonusAttributes.get(entity);

    for (uint i; i < attributeData.length; i++) {
      AttributeData memory attribute = attributeData[i];

      playerAttributes.healthMax += attribute.healthMax;
      playerAttributes.strength += attribute.strength;
      playerAttributes.staminaMax += attribute.staminaMax;
      playerAttributes.staminaRegen += attribute.staminaRegen;
      playerAttributes.staminaCost += attribute.staminaCost;
      playerAttributes.moveSpeed += attribute.moveSpeed;
      playerAttributes.heal += attribute.heal;
      playerAttributes.rangeMin += attribute.rangeMin;
      playerAttributes.rangeMax += attribute.rangeMax;
    }

    BonusAttributes.set(entity, playerAttributes);
  }

  function unequip(bytes32 entity, bytes32 item) internal {
    LibStamina.spend(entity, 10_000);

    require(EquippedBy.get(item) == entity, "Item is not equipped by entity");

    EquippedBy.deleteRecord(item);

    AttributeData[] memory attributeData = getItemAttributeData(item);
    BonusAttributesData memory playerAttributes = BonusAttributes.get(entity);

    for (uint i; i < attributeData.length; i++) {
      AttributeData memory attribute = attributeData[i];

      playerAttributes.healthMax -= attribute.healthMax;
      playerAttributes.strength -= attribute.strength;
      playerAttributes.staminaMax -= attribute.staminaMax;
      playerAttributes.staminaRegen -= attribute.staminaRegen;
      playerAttributes.staminaCost -= attribute.staminaCost;
      playerAttributes.moveSpeed -= attribute.moveSpeed;
      playerAttributes.heal -= attribute.heal;
      playerAttributes.rangeMin -= attribute.rangeMin;
      playerAttributes.rangeMax -= attribute.rangeMax;
    }

    BonusAttributes.set(entity, playerAttributes);
  }

  function getFreeEquipSlots(bytes32 entity) internal view returns (uint32) {
    uint32 equipSlots = Inventory.getEquipSize(entity);
    uint256 equippedItemsLength = getKeysWithValue(EquippedByTableId, EquippedBy.encode(entity)).length;

    return equipSlots - uint32(equippedItemsLength);
  }

  function getItemAttributeData(bytes32 item) internal view returns (AttributeData[] memory attributeData) {
    bytes32[] memory attributes = getKeysWithValue(OnItemTableId, OnItem.encode(item));

    attributeData = new AttributeData[](attributes.length);
    for (uint256 i = 0; i < attributes.length; i++) {
      attributeData[i] = Attribute.get(attributes[i]);
    }
  }
}
