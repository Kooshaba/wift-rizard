export enum ItemTypes {
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

export const ItemTypeNames = {
  [ItemTypes.Sword]:"Sword",
  [ItemTypes.Dagger]:"Dagger",
  [ItemTypes.Spear]:"Spear",
  [ItemTypes.Hammer]:"Hammer",
  [ItemTypes.Axe]:"Axe",
  [ItemTypes.Shield]:"Shield",
  [ItemTypes.Bow]:"Bow",
  [ItemTypes.BowLarge]:"BowLarge",
  [ItemTypes.Staff]:"Staff",
  [ItemTypes.DevilHorn]:"DevilHorn",
  [ItemTypes.DevilHornLarge]:"DevilHornLarge",
} as Record<number, string>;