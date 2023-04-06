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
