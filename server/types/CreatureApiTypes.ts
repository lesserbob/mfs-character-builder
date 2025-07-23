export interface apiCreatureItem {
  itemId: number;
  quantity: number;
}

export interface apiCreature {
  id?: number;
  name: string;
  level?: number;
  might: number;
  agility: number;
  intellect: number;
  spirit: number;
  wealth: number;
  classes: number[];
  features: number[];
  items: apiCreatureItem[];
  portrait: string | null;
}
