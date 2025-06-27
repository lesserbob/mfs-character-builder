import { PrismaClient, ClassClassification } from '@prisma/client';
import { apiClass, apiSelectableList } from '../types/ClassApiTypes';

const prisma = new PrismaClient();

export const getClasses = async (
  classification?: ClassClassification
): Promise<apiClass[]> => {
  const classes = await prisma.class.findMany({
    where: classification
      ? {
          classification: classification,
        }
      : undefined,
    include: {
      classLevels: {
        include: {
          classFeatures: true,
        },
      },
    },
  });

  return classes.map((cl) => ({
    id: cl.id,
    name: cl.name,
    classification: cl.classification,
    minMight: cl.minMight ?? undefined,
    minAgility: cl.minAgility ?? undefined,
    minIntellect: cl.minIntellect ?? undefined,
    minSpirit: cl.minSpirit ?? undefined,
    classLevels: cl.classLevels.map((level) => ({
      id: level.id,
      classId: level.classId,
      level: level.level,
      health: level.health,
      statBonus: level.statBonus,
      features: level.classFeatures.map((feature) => ({
        id: feature.id,
        classLevelId: feature.classLevelId,
        name: feature.name,
        description: feature.description,
        type: feature.type as any,
        selectableListId: feature.selectableListId ?? undefined,
        selectableCount: feature.selectableCount ?? undefined,
      })),
    })),
  }));
};

export const getClassById = async (id: number): Promise<apiClass | null> => {
  const cl = await prisma.class.findUnique({
    where: { id },
    include: {
      classLevels: {
        include: {
          classFeatures: true,
        },
      },
    },
  });

  if (!cl) {
    return null;
  }

  return {
    id: cl.id,
    name: cl.name,
    classification: cl.classification,
    minMight: cl.minMight ?? undefined,
    minAgility: cl.minAgility ?? undefined,
    minIntellect: cl.minIntellect ?? undefined,
    minSpirit: cl.minSpirit ?? undefined,
    classLevels: cl.classLevels.map((level) => ({
      id: level.id,
      classId: level.classId,
      level: level.level,
      health: level.health,
      statBonus: level.statBonus,
      features: level.classFeatures.map((feature) => ({
        id: feature.id,
        classLevelId: feature.classLevelId,
        name: feature.name,
        description: feature.description,
        type: feature.type as any,
        selectableListId: feature.selectableListId ?? undefined,
        selectableCount: feature.selectableCount ?? undefined,
      })),
    })),
  };
};

export const getSelectableListById = async (
  id: number
): Promise<apiSelectableList | null> => {
  const list = await prisma.selectableList.findUnique({
    where: { id },
    include: {
      selectableItems: true,
    },
  });

  if (!list) {
    return null;
  }

  return {
    id: list.id,
    name: list.name,
    items: list.selectableItems.map((item) => ({
      id: item.id,
      selectableListId: item.selectableListId,
      name: item.name,
      description: item.description,
    })),
  };
};
