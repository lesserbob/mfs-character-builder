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

export interface apiClassLevelFeature {
  id: number;
  classLevelId: number;
  name: string;
  description: string;
}
