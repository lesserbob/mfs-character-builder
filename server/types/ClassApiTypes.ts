export interface apiClass {
  id: number;
  name: string;
  classification: string;
  minMight?: number;
  minAgility?: number;
  minIntellect?: number;
  minSpirit?: number;
  classLevels: apiClassLevel[];
}

export enum ClassClassification {
  RACE = 'RACE',
  PATH = 'PATH',
  SPECIALISATION = 'SPECIALISATION',
}

export interface apiClassLevel {
  id: number;
  classId: number;
  level: number;
  health: number;
  statBonus: number;
  features: apiClassLevelFeature[];
}

export enum ClassFeatureType {
  BASE = 'BASE',
  SELECT = 'SELECT',
}

export enum ActionType {
  STANDARD = 'STANDARD',
  MINOR = 'MINOR',
  REACTION = 'REACTION',
  FREE = 'FREE',
  MOVE = 'MOVE',
}

export interface apiClassLevelFeature {
  id: number;
  classLevelId: number;
  name: string;
  description: string;
  type: ClassFeatureType;
  display: boolean;
  enduranceRegeneration?: number;
  selectableListId?: number;
  selectableCount?: number;
}

export interface apiSelectableFeatureList {
  id: number;
  name: string;
  features: apiSelectableFeature[];
}

export interface apiSelectableFeature {
  id: number;
  name: string;
  description: string;
  requiredSelectableFeatureId?: number;
  actionType?: ActionType;
  uses?: number;
}
