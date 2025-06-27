import { Prisma, PrismaClient } from '@prisma/client';
import { apiCreature } from '../types/CreatureApiTypes';

const prisma = new PrismaClient();

// Returns a creature type given id
export const getCreature = async (id: number): Promise<apiCreature> => {
  const deCreature = await prisma.creature.findUnique({
    where: {
      id: id,
    },
    include: {
      features: true,
    },
  });

  if (!deCreature) {
    throw new Error(`Creature with id ${id} not found`);
  }

  // Get creature classes separately
  const creatureClasses = await prisma.creatureClass.findMany({
    where: { creatureId: id },
  });

  const result = mapDeCreatureToApiCreature(deCreature, creatureClasses);
  return result;
};

export const getCreatures = async (): Promise<apiCreature[]> => {
  const deCreatures = await prisma.creature.findMany({
    include: {
      features: true,
    },
  });

  // TODO: This is a hack to get the creature classes. We should find a better way to do this.
  const allCreatureClasses = await prisma.creatureClass.findMany();

  return deCreatures.map((deCreature) => {
    const creatureClasses = allCreatureClasses.filter(
      (cc: any) => cc.creatureId === deCreature.id
    );
    return mapDeCreatureToApiCreature(deCreature, creatureClasses);
  });
};

export const mapDeCreatureToApiCreature = (
  deCreature: Prisma.CreatureGetPayload<{
    include: { features: true };
  }>,
  creatureClasses: any[]
): apiCreature => {
  const result: apiCreature = {
    id: deCreature.id,
    name: deCreature.name,
    level: deCreature.level,
    might: deCreature.might,
    agility: deCreature.agility,
    intellect: deCreature.intellect,
    spirit: deCreature.spirit,
    classes: creatureClasses.map((cc) => cc.classId),
    features: deCreature.features.map((f) => f.featureId),
  };
  return result;
};

export const createCreature = async (
  creature: apiCreature
): Promise<number> => {
  const newCreature = await prisma.creature.create({
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

  // Create CreatureClass records for each class ID
  if (creature.classes && creature.classes.length > 0) {
    await prisma.creatureClass.createMany({
      data: creature.classes.map((classId) => ({
        creatureId: newCreature.id,
        classId: classId,
      })),
    });
  }

  return newCreature.id;
};

export const updateCreature = async (id: number, creature: apiCreature) => {
  await prisma.creature.update({
    where: { id },
    data: {
      name: creature.name,
      level: creature.level,
      might: creature.might,
      agility: creature.agility,
      intellect: creature.intellect,
      spirit: creature.spirit,
    },
  });

  // Add / remove classes
  {
    // 1. Get current class IDs for this creature
    const existing = await prisma.creatureClass.findMany({
      where: { creatureId: id },
    });
    const existingClassIds = existing.map((cc) => cc.classId);

    // 2. Find which to add and which to remove
    const newClassIds = creature.classes ?? [];
    const toAdd = newClassIds.filter((cid) => !existingClassIds.includes(cid));
    const toRemove = existingClassIds.filter(
      (cid) => !newClassIds.includes(cid)
    );

    // 3. Remove only those not needed (optional: check for children before deleting)
    if (toRemove.length > 0) {
      await prisma.creatureClass.deleteMany({
        where: {
          creatureId: id,
          classId: { in: toRemove },
        },
      });
    }

    // 4. Add new ones
    if (toAdd.length > 0) {
      await prisma.creatureClass.createMany({
        data: toAdd.map((classId) => ({
          creatureId: id,
          classId,
        })),
      });
    }
  }

  // Add / remove selectable features
  {
    // 1. Get current feature IDs for this creature
    const existing = await prisma.creatureSelectedFeature.findMany({
      where: { creatureId: id },
    });
    const existingFeatureIds = existing.map((cf) => cf.featureId);

    // 2. Find which to add and which to remove
    const newFeatureIds = creature.features ?? [];
    const toAdd = newFeatureIds.filter(
      (fid) => !existingFeatureIds.includes(fid)
    );
    const toRemove = existingFeatureIds.filter(
      (fid) => !newFeatureIds.includes(fid)
    );

    // 3. Remove only those not needed (optional: check for children before deleting)
    if (toRemove.length > 0) {
      await prisma.creatureSelectedFeature.deleteMany({
        where: {
          creatureId: id,
          featureId: { in: toRemove },
        },
      });
    }

    // 4. Add new ones
    if (toAdd.length > 0) {
      await prisma.creatureSelectedFeature.createMany({
        data: toAdd.map((featureId) => ({
          creatureId: id,
          featureId,
        })),
      });
    }
  }
};
