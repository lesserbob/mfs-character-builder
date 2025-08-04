import { Prisma, PrismaClient } from '@prisma/client';
import { apiLocation, apiStory } from '../types/StoryTypes';

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

export const getLocations = async (storyId: number): Promise<apiLocation[]> => {
  const deLocations = await prisma.location.findMany({
    where: {
      storyId: storyId,
    },
  });

  return deLocations.map((deLocation) =>
    mapDeLocationToApiLocation(deLocation)
  );
};

export const getLocation = async (id: number): Promise<apiLocation> => {
  const deLocation = await prisma.location.findUnique({
    where: {
      id: id,
    },
  });

  if (!deLocation) {
    throw new Error(`Location not found for id: ${id}`);
  }

  return mapDeLocationToApiLocation(deLocation);
};

const mapDeLocationToApiLocation = (
  deLocation: Prisma.LocationGetPayload<{}>
): apiLocation => {
  const apiLocation = {
    id: deLocation.id,
    name: deLocation.name,
    description: deLocation.description,
  };

  return apiLocation;
};

export const createLocation = async (
  storyId: number,
  location: apiLocation
): Promise<number> => {
  const deLocation = await prisma.location.create({
    data: {
      name: location.name,
      description: location.description,
      storyId: storyId,
    },
    select: {
      id: true,
    },
  });

  return deLocation.id;
};
