import { Prisma, PrismaClient } from '@prisma/client';
import {
  apiActor,
  apiAddActorInstruction,
  apiLocation,
  apiStory,
} from '../types/StoryTypes';
import {
  creatureInclude,
  getCreature,
  mapDeCreatureToApiCreature,
} from './CreatureService';

const prisma = new PrismaClient();

export const actorInclude = {
  creature: {
    include: creatureInclude,
  },
} as const;

export type ActorFromDb = Prisma.ActorGetPayload<{
  include: typeof actorInclude;
}>;

export const locationInclude = {
  zones: {
    include: {
      actors: {
        include: actorInclude,
      },
    },
  },
} as const;

export type LocationFromDb = Prisma.LocationGetPayload<{
  include: typeof locationInclude;
}>;

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

/**
 * Locations
 */
export const getLocations = async (storyId: number): Promise<apiLocation[]> => {
  const deLocations = await prisma.location.findMany({
    where: {
      storyId: storyId,
    },
    include: locationInclude,
  });

  return deLocations.map((deLocation) =>
    mapDeLocationToApiLocation(deLocation, false)
  );
};

export const getLocation = async (id: number): Promise<apiLocation> => {
  const deLocation = await prisma.location.findUnique({
    where: {
      id: id,
    },
    include: locationInclude,
  });

  if (!deLocation) {
    throw new Error(`Location not found for id: ${id}`);
  }

  return mapDeLocationToApiLocation(deLocation, true);
};

const mapDeLocationToApiLocation = (
  deLocation: LocationFromDb,
  includeZones: boolean
): apiLocation => {
  const apiLocation = {
    id: deLocation.id,
    name: deLocation.name,
    description: deLocation.description,
    zones: includeZones
      ? deLocation.zones.map((z) => ({
          id: z.id,
          name: z.name,
          description: z.description,
          xpos: z.xpos,
          ypos: z.ypos,
          actors: z.actors.map((actor) => mapDeActorToApiActor(actor)),
        }))
      : [],
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

export const updateLocation = async (
  locationId: number,
  location: apiLocation
) => {
  await prisma.location.update({
    where: {
      id: locationId,
    },
    data: {
      name: location.name,
      description: location.description,
    },
  });

  // Add / remove zones
  {
    // 1. Get current zones
    const existingZones = await prisma.zone.findMany({
      where: { locationId: locationId },
    });

    const existingZoneIds = existingZones.map((cc) => cc.id);

    // 2. Find which to add, which to remove and which to update
    const newZones = location.zones ?? [];
    const toAdd = newZones.filter((z) => !existingZoneIds.includes(z.id));
    const toRemove = existingZoneIds.filter(
      (zid) => !newZones.map((z) => z.id).includes(zid)
    );
    const toUpdate = newZones.filter(
      (z) =>
        !toAdd.map((ta) => ta.id).includes(z.id) && !toRemove.includes(z.id)
    );

    // 3. Remove not required any more
    if (toRemove.length > 0) {
      await prisma.zone.deleteMany({
        where: {
          id: { in: toRemove },
        },
      });
    }

    // 4. Add new ones
    if (toAdd.length > 0) {
      await prisma.zone.createMany({
        data: toAdd.map((z) => ({
          name: z.name,
          description: z.description,
          locationId: locationId,
          xpos: z.xpos,
          ypos: z.ypos,
        })),
      });
    }

    // 5. Update modified
    if (toUpdate.length > 0) {
      await Promise.all(
        toUpdate.map((z) =>
          prisma.zone.update({
            where: { id: z.id },
            data: {
              name: z.name,
              description: z.description,
              xpos: z.xpos,
              ypos: z.ypos,
            },
          })
        )
      );
    }
  }
};

/**
 * Actors from this point
 */
export const getActors = async (storyId: number): Promise<apiActor[]> => {
  const deActors = await prisma.actor.findMany({
    where: {
      storyId: storyId,
    },
    include: actorInclude,
  });

  return deActors.map((a) => mapDeActorToApiActor(a));
};

const mapDeActorToApiActor = (deActor: ActorFromDb): apiActor => {
  const apiActor = {
    id: deActor.id,
    creatureId: deActor.creatureId,
    creature: mapDeCreatureToApiCreature(deActor.creature),
    zoneId: deActor.zoneId ?? undefined,
    enduranceDamage: deActor.enduranceDamage,
    healthDamage: deActor.healthDamage,
    momentumSpent: deActor.momentumSpent,
    actionPoints: deActor.actionPoints,
    standardActions: deActor.standardActions,
    tacticalSurgeToken: deActor.tacticalSurgeToken,
    tacticalActionsTaken: deActor.tacticalActionsTaken,
    acting: deActor.acting,
  };

  return apiActor;
};

/**
 * Adds actors to a story
 */
export const addActors = async (
  storyId: number,
  instruction: apiAddActorInstruction[]
) => {
  const actors = instruction.flatMap((i) => {
    return Array.from({ length: i.count }, () => ({
      creatureId: i.creatureId,
      storyId,
    }));
  });

  await prisma.actor.createMany({
    data: actors,
  });
};

export const updateActor = async (actorId: number, actor: apiActor) => {
  await prisma.actor.update({
    where: { id: actorId },
    data: {
      zoneId: actor.zoneId,
      enduranceDamage: actor.enduranceDamage,
      healthDamage: actor.healthDamage,
      momentumSpent: actor.momentumSpent,
      actionPoints: actor.actionPoints,
      standardActions: actor.standardActions,
      tacticalSurgeToken: actor.tacticalSurgeToken,
      tacticalActionsTaken: actor.tacticalActionsTaken,
    },
  });
};
