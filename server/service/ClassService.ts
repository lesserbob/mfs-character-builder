import { PrismaClient, ClassClassification } from '@prisma/client';
import { apiClass, apiSelectableFeatureList } from '../types/ClassApiTypes';

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
        selectableListId: feature.selectableFeatureListId ?? undefined,
        selectableCount: feature.selectableFeatureCount ?? undefined,
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
        selectableListId: feature.selectableFeatureListId ?? undefined,
        selectableCount: feature.selectableFeatureCount ?? undefined,
      })),
    })),
  };
};

export const getSelectableFeatureListById = async (
  id: number
): Promise<apiSelectableFeatureList | null> => {
  const list = await prisma.selectableFeatureList.findUnique({
    where: { id },
    include: {
      selectableFeatures: true,
    },
  });

  if (!list) {
    return null;
  }

  return {
    id: list.id,
    name: list.name,
    features: list.selectableFeatures.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      requiredSelectableFeatureId:
        item.requiredSelectableFeatureId ?? undefined,
    })),
  };
};
