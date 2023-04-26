import { Animations, Sprites } from "../phaser/constants";

export const ROOM_WIDTH = 12;
export const ROOM_HEIGHT = 6;

export enum ItemTypes {
  Unknown,
  Sword,
  Dagger,
  Spear,
  Hammer,
  Axe,
  Shield,
  Bow,
  BowLarge,
  Staff,
  DevilHorn,
  DevilHornLarge,
}

export enum MonsterTypes {
  Unknown,
  Spawner,
  Skeleton,
  SkeletonArcher,
  Spider,
}

export enum AttributeTypes {
  None,
  Fortitude,
  Strong,
  Lightweight,
  Alacrity,
  Swift,
  Godlike
}

export enum NameTypes {
  Prefix = "Prefix",
  Suffix = "Suffix"
}

type AttributeNameData = {
  type: NameTypes,
  value: string,
}

export const AttributeTypeNameData = {
  [AttributeTypes.None]: {
    type: NameTypes.Prefix,
    value: "Unknown "
  },
  [AttributeTypes.Fortitude]: {
    type: NameTypes.Suffix,
    value: " of Fortitude",
  },
  [AttributeTypes.Strong]: {
    type: NameTypes.Suffix,
    value: " of Strength",
  },
  [AttributeTypes.Lightweight]: {
    type: NameTypes.Prefix,
    value: "Lightweight "
  },
  [AttributeTypes.Alacrity]: {
    type: NameTypes.Suffix,
    value: " of Alacrity",
  },
  [AttributeTypes.Swift]: {
    type: NameTypes.Prefix,
    value: "Swift "
  },
  [AttributeTypes.Godlike]: {
    type: NameTypes.Prefix,
    value: "Godlike "
  },
} satisfies Record<AttributeTypes, AttributeNameData>;

export const ItemTypeNames = {
  [ItemTypes.Sword]: "Sword",
  [ItemTypes.Dagger]: "Dagger",
  [ItemTypes.Spear]: "Spear",
  [ItemTypes.Hammer]: "Hammer",
  [ItemTypes.Axe]: "Axe",
  [ItemTypes.Shield]: "Shield",
  [ItemTypes.Bow]: "Bow",
  [ItemTypes.BowLarge]: "BowLarge",
  [ItemTypes.Staff]: "Staff",
  [ItemTypes.DevilHorn]: "DevilHorn",
  [ItemTypes.DevilHornLarge]: "DevilHornLarge",
} as Record<number, string>;

export const ItemTypeSprites = {
  [ItemTypes.Sword]: Sprites.Sword,
  [ItemTypes.Dagger]: Sprites.Dagger,
  [ItemTypes.Spear]: Sprites.Spear,
  [ItemTypes.Hammer]: Sprites.Hammer,
  [ItemTypes.Axe]: Sprites.Axe,
  [ItemTypes.Shield]: Sprites.Shield,
  [ItemTypes.Bow]: Sprites.Bow,
  [ItemTypes.BowLarge]: Sprites.BowLarge,
  [ItemTypes.Staff]: Sprites.Staff,
  [ItemTypes.DevilHorn]: Sprites.DevilHorn,
  [ItemTypes.DevilHornLarge]: Sprites.DevilHornLarge,
} as Record<number, Sprites>;

export const MonsterTypeNames = {
  [MonsterTypes.Skeleton]: "Skeleton",
  [MonsterTypes.SkeletonArcher]: "Skeleton Archer",
  [MonsterTypes.Spider]: "Spider",
} as Record<number, string>;

export const MonsterTypeColors = {
  [MonsterTypes.Skeleton]: 0xb00b1e,
  [MonsterTypes.SkeletonArcher]: 0xb00b1e,
  [MonsterTypes.Spider]: 0xb00b1e,
  [MonsterTypes.Spawner]: 0x9e9e00,
} as Record<number, number>;

export const MonsterTypeAnimations = {
  [MonsterTypes.Skeleton]: Animations.SkeletonSword,
  [MonsterTypes.SkeletonArcher]: Animations.SkeletonBow,
  [MonsterTypes.Spawner]: Animations.Spawner,
} as Record<number, string>;
