import { PrismaClient } from '@prisma/client';
import { apiCreature } from '../types/CreatureApiTypes';

const prisma = new PrismaClient();

// Returns a creature type given id
export const getCreature = async (id: number): Promise<apiCreature> => {
    const deCreature = await prisma.creature.findUnique({
        where: {
      id: id,
    },
  });

  if (!deCreature) {
    throw new Error(`Creature with id ${id} not found`);
  }

    const result: apiCreature = {
        name: deCreature.name,
        level: deCreature.level,
        might: deCreature.might,
        agility: deCreature.agility,
        intellect: deCreature.intellect,
        spirit: deCreature.spirit,
  };
    return result;
};

export const createCreature = async (creature: apiCreature): Promise<number> => {
  const newCreature =await prisma.creature.create({
    data: {
      name: creature.name,
      level: creature.level,
      might: creature.might,
      agility: creature.agility,
      intellect: creature.intellect,
      spirit: creature.spirit,
    },
    select: {
      id: true,
    },
  });
  return newCreature.id;
};
