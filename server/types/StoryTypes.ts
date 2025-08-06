import { apiCreature } from './CreatureApiTypes';

export interface apiStory {
  id: number;
  name: string;
  description: string;
  locations?: apiLocation[];
}

export interface apiLocation {
  id: number;
  name: string;
  description: string;
  zones: apiZone[];
}

export interface apiZone {
  id: number;
  name: string;
  description: string;
  xpos: number;
  ypos: number;
  actors?: apiActor[];
}

/**
 * Adding an actor involves information and descisions beyond reasonable
 * expectation of the interface. This is server side stuff
 */
export interface apiAddActorInstruction {
  creatureId: number;
  count: number;
}

export interface apiActor {
  id: number;
  creatureId: number;
  creature?: apiCreature;
  zoneId?: number;
  enduranceDamage: number;
  healthDamage: number;
  momentumSpent: number;
  actionPoints: number;
  standardActions: number;
  tacticalSurgeToken: boolean;
  tacticalActionsTaken: number;
  acting: boolean;
}
