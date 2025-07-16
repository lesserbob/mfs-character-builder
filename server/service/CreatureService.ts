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
      items: true,
      classes: true,
    },
  });

  if (!deCreature) {
    throw new Error(`Creature with id ${id} not found`);
  }

  const result = mapDeCreatureToApiCreature(deCreature);
  return result;
};

export const getCreatures = async (user: any): Promise<apiCreature[]> => {
  // export const getCreatures = async (userId: number): Promise<apiCreature[]> => {
  const filterByUserId = user.type === 'PLAYER';
  const userId = user.id!;
  const deCreatures = await prisma.creature.findMany({
    where: {
      ...(filterByUserId ? { userId: userId } : {}),
    },
    include: {
      features: true,
      items: true,
      classes: true,
    },
  });

  return deCreatures.map((deCreature) => {
    return mapDeCreatureToApiCreature(deCreature);
  });
};

export const mapDeCreatureToApiCreature = (
  deCreature: Prisma.CreatureGetPayload<{
    include: { features: true; items: true; classes: true };
  }>
): apiCreature => {
  const result: apiCreature = {
    id: deCreature.id,
    name: deCreature.name,
    level: deCreature.level,
    might: deCreature.might,
    agility: deCreature.agility,
    intellect: deCreature.intellect,
    spirit: deCreature.spirit,
    wealth: deCreature.wealth,
    classes: deCreature.classes.map((c) => c.classId),
    features: deCreature.features.map((f) => f.featureId),
    items: deCreature.items.map((i) => ({
      itemId: i.itemId,
      quantity: i.quantity,
    })),
  };
  return result;
};

export const createCreature = async (
  creature: apiCreature,
  userId: number
): Promise<number> => {
  const newCreature = await prisma.creature.create({
    data: {
      name: creature.name,
      level: creature.level,
      might: creature.might,
      agility: creature.agility,
      intellect: creature.intellect,
      spirit: creature.spirit,
      wealth: 3, // Default to 3 wealth
      userId: userId,
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

  // Create CreatureSelectedFeature records for each feature ID
  if (creature.features && creature.features.length > 0) {
    await prisma.creatureSelectedFeature.createMany({
      data: creature.features.map((featureId) => ({
        creatureId: newCreature.id,
        featureId: featureId,
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
      wealth: creature.wealth,
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

  // Add / Remove items
  {
    const existingItems = await prisma.creatureItem.findMany({
      where: { creatureId: id },
    });
    const existingItemIds = existingItems.map(
      (existingItem) => existingItem.itemId
    );

    const newItems = creature.items ?? [];
    const newItemIds = newItems.map((item) => item.itemId);

    const itemsToAdd = newItems.filter(
      (newItem) => !existingItemIds.includes(newItem.itemId)
    );
    const itemIdsToRemove = existingItemIds.filter(
      (existingId) => !newItemIds.includes(existingId)
    );
    const itemsToUpdate = existingItemIds.filter((iid) =>
      newItemIds.includes(iid)
    );

    if (itemsToAdd.length > 0) {
      await prisma.creatureItem.createMany({
        data: itemsToAdd.map((item) => ({
          creatureId: id,
          itemId: item.itemId,
          quantity: item.quantity,
        })),
      });
    }

    if (itemsToUpdate.length > 0) {
      await Promise.all(
        itemsToUpdate.map((itemId) => {
          const newItem = newItems.find((item) => item.itemId === itemId);
          if (newItem) {
            return prisma.creatureItem.updateMany({
              where: { creatureId: id, itemId },
              data: { quantity: newItem.quantity },
            });
          }
        })
      );
    }
    if (itemIdsToRemove.length > 0) {
      await prisma.creatureItem.deleteMany({
        where: {
          creatureId: id,
          itemId: { in: itemIdsToRemove },
        },
      });
    }
  }
};
