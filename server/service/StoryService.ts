import { Prisma, PrismaClient } from '@prisma/client';
import { apiStory } from '../types/StoryTypes';

const prisma = new PrismaClient();

export const getStory = async (id: number): Promise<apiStory> => {
  const deStory = await prisma.story.findUnique({
    where: {
      id: id,
    },
  });

  if (!deStory) {
    throw new Error(`Story with id ${id} not found`);
  }

  return mapDeStoryToApiStory(deStory);
};

// TODO : For non GM, this should be limited to stories that are player has an actor in
// TODO : Differentiate. When searching, dont bundle children
export const getStories = async (): Promise<apiStory[]> => {
  const deStories = await prisma.story.findMany({});

  return deStories.map((deStory) => mapDeStoryToApiStory(deStory));
};

const mapDeStoryToApiStory = (
  deStory: Prisma.StoryGetPayload<{}>
): apiStory => {
  const apiStory = {
    id: deStory.id,
    name: deStory.name,
    description: deStory.description,
  };

  return apiStory;
};

export const createStory = async (story: apiStory): Promise<number> => {
  const deStory = await prisma.story.create({
    data: {
      name: story.name,
      description: story.description,
    },
    select: {
      id: true,
    },
  });

  return deStory.id;
};
