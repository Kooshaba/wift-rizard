// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { ItemTypes } from "../Types.sol";

import { ItemType } from "../tables/ItemType.sol";
import { Attack, AttackData } from "../tables/Attack.sol";

library LibItemFactory {
  function createSword() internal returns (bytes32) {
    return createWeapon("sword", ItemTypes.Sword, 10, 25000, 1, 1, new int32[](1), new int32[](1));
  }

  function createDagger() internal returns (bytes32) {
    return createWeapon("dagger", ItemTypes.Dagger, 5, 20000, 1, 1, new int32[](1), new int32[](1));
  }

  function createSpear() internal returns (bytes32) {
    int32[] memory patternX = new int32[](2);
    patternX[0] = 0;
    patternX[1] = 0;

    int32[] memory patternY = new int32[](2);
    patternY[0] = 0;
    patternY[1] = 1;

    return createWeapon("spear", ItemTypes.Spear, 10, 40000, 1, 1, patternX, patternY);
  }

  function createHammer() internal returns (bytes32) {
    return createWeapon("hammer", ItemTypes.Hammer, 15, 40000, 1, 1, new int32[](1), new int32[](1));
  }

  function createAxe() internal returns (bytes32) {
    int32[] memory patternX = new int32[](3);
    patternX[0] = -1;
    patternX[1] = 0;
    patternX[2] = 1;

    int32[] memory patternY = new int32[](3);
    patternY[0] = 0;
    patternY[1] = 0;
    patternY[2] = 0;

    return createWeapon("axe", ItemTypes.Axe, 8, 40000, 1, 1, patternX, patternY);
  }

  function createShield() internal returns (bytes32) {
    return createWeapon("shield", ItemTypes.Shield, 8, 40000, 1, 1, new int32[](1), new int32[](1));
  }

  function createBow() internal returns (bytes32) {
    return createWeapon("bow", ItemTypes.Bow, 10, 25000, 2, 3, new int32[](1), new int32[](1));
  }

  function createBowLarge() internal returns (bytes32) {
    int32[] memory patternX = new int32[](3);
    patternX[0] = -1;
    patternX[1] = 0;
    patternX[2] = 1;

    int32[] memory patternY = new int32[](3);
    patternY[0] = 0;
    patternY[1] = 0;
    patternY[2] = 0;

    return createWeapon("bowLarge", ItemTypes.BowLarge, 8, 40000, 2, 3, patternX, patternY);
  }

  function createStaff() internal returns (bytes32) {
    return createWeapon("staff", ItemTypes.Staff, 5, 40000, 1, 2, new int32[](1), new int32[](1));
  }

  function createDevilHorn() internal returns (bytes32) {
    int32[] memory patternX = new int32[](3);
    patternX[0] = -1;
    patternX[1] = 0;
    patternX[2] = 1;

    int32[] memory patternY = new int32[](3);
    patternY[0] = -1;
    patternY[1] = 0;
    patternY[2] = -1;

    return createWeapon("devilHorn", ItemTypes.DevilHorn, 8, 40000, 2, 3, patternX, patternY);
  }

  function createDevilHornLarge() internal returns (bytes32) {
    int32[] memory patternX = new int32[](5);
    patternX[0] = -1;
    patternX[1] = 1;
    patternX[2] = 0;
    patternX[3] = -1;
    patternX[4] = 1;

    int32[] memory patternY = new int32[](5);
    patternY[0] = 1;
    patternY[1] = 1;
    patternY[2] = 0;
    patternY[3] = -1;
    patternY[4] = -1;

    return createWeapon("devilHornLarge", ItemTypes.DevilHornLarge, 12, 60000, 2, 3, patternX, patternY);
  }

  function createWeapon(
    bytes32 name,
    ItemTypes itemType,
    int32 strength,
    int32 staminaCost,
    int32 minRange,
    int32 maxRange,
    int32[] memory attackPatternX,
    int32[] memory attackPatternY
  ) internal returns (bytes32) {
    bytes32 id = generateUniqueId(name);

    ItemType.set(id, uint32(itemType));

    Attack.set(
      id,
      AttackData({
        strength: strength,
        staminaCost: staminaCost,
        minRange: minRange,
        maxRange: maxRange,
        patternX: attackPatternX,
        patternY: attackPatternY
      })
    );

    return id;
  }

  function generateUniqueId(bytes32 seed) internal view returns (bytes32) {
    return keccak256(abi.encodePacked(seed, block.number, blockhash(block.number - 1)));
  }

  function getRandomItem(uint256 seed) internal returns (bytes32) {
    uint256 itemSeed = seed % 11;

    if (itemSeed == 0) {
      return createSword();
    } else if (itemSeed == 1) {
      return createDagger();
    } else if (itemSeed == 2) {
      return createSpear();
    } else if (itemSeed == 3) {
      return createHammer();
    } else if (itemSeed == 4) {
      return createAxe();
    } else if (itemSeed == 5) {
      return createShield();
    } else if (itemSeed == 6) {
      return createBow();
    } else if (itemSeed == 7) {
      return createBowLarge();
    } else if (itemSeed == 8) {
      return createStaff();
    } else if (itemSeed == 9) {
      return createDevilHorn();
    } else {
      return createDevilHornLarge();
    }
  }
}
