export interface apiCreatureItem {
  itemId: number;
  quantity: number;
}

export interface apiBespokeFeature {
  name: string;
  description: string;
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
  type: string;
  baseHealth: number;
  bespokeFeatures: apiBespokeFeature[];
}
