type GearType = 'MELEE' | 'RANGED' | 'ARMOR' | 'MISCELLANEOUS';
type RateOfFire = 'SINGLE' | 'BURST' | 'FULL_AUTO' | 'SEMI_AUTO';
type Range = 'NEARBY' | 'MEDIUM' | 'LONG' | 'EXTREME';
type Reliability = 'RELIABLE' | 'NORMAL' | 'UNRELIABLE';
type ArmorType = 'OUTFIT' | 'HARDENED';

export interface apiItem {
  id: number;
  name: string;
  type: GearType;
  rank: number;
  damageUnarmored: number | null;
  damageArmored: number | null;
  concealable: boolean;
  twoHanded: boolean;
  reach: boolean;
  finesse: boolean;
  thrown: boolean;
  attacksWorthOfAmmo: number | null;
  rateOfFire: RateOfFire | null;
  range: Range | null;
  reliability: Reliability | null;
  scatter: boolean;
  sniper: boolean;
  brace: boolean;
  armorType: ArmorType | null;
  soak: number | null;
}
