import { Prisma, PrismaClient } from '@prisma/client';
import {
  apiActor,
  apiAddActorInstruction,
  apiLocation,
  apiStory,
} from '../types/StoryTypes';
import { creatureInclude, mapDeCreatureToApiCreature } from './CreatureService';
import { apiCreature } from '../types/CreatureApiTypes';
import { parseLocationUpdate } from '../utils/LocationUtils';

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
    storyId: deLocation.storyId,
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
    actingFaction: deLocation.actingFaction,
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
  // We need to examine what is updating.
  // Pre load the location so we have some ability to compare
  const currentLocation = await getLocation(locationId);

  const updatedActors = parseLocationUpdate(currentLocation, location);
  await Promise.all(updatedActors.map((actor) => updateActor(actor.id, actor)));

  await prisma.location.update({
    where: {
      id: locationId,
    },
    data: {
      name: location.name,
      description: location.description,
      actingFaction: location.actingFaction,
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
  // This is currently used for one point only which is the list of actors on
  // front of sotry, where we only want to show players

  const deActors = await prisma.actor.findMany({
    where: {
      storyId: storyId,
      creature: {
        type: 'PLAYER',
      },
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
  instructions: apiAddActorInstruction[]
) => {
  // Create array of actors from map

  /*
  There are 3 scenarios I need to think about
  
  NOTE: We will always have a story id and each element will always have a creature id

  a. Adding player to story
  There will not be a count
  There will not be a zone id

  This is an ordinary create of a single actor

  b. Adding player already in the story to a zone
  There will not be a count
  There will be a zone id

  This is an update of an actor
  We therefore need to lookup the single actor (given story and creature)
  Then update it

  c. Adding antagonists to zone
  There will be a count
  There will be a zone id

  This is the creation of a number of actors of the given count+creature+story
  */
  for (const instruction of instructions) {
    if (!instruction.count && !instruction.zoneId) {
      // Case a
      await prisma.actor.create({
        data: { creatureId: instruction.creatureId, storyId: storyId },
      });
    }

    if (!instruction.count && instruction.zoneId) {
      // Case b
      await prisma.actor.updateMany({
        where: {
          creatureId: instruction.creatureId,
          storyId: storyId,
        },
        data: {
          zoneId: instruction.zoneId,
        },
      });
    }

    if (instruction.count && instruction.zoneId) {
      // Case c
      for (let i = 1; i <= instruction.count; i++) {
        await prisma.actor.create({
          data: {
            creatureId: instruction.creatureId,
            storyId: storyId,
            zoneId: instruction.zoneId,
          },
        });
      }
    }
  }
};

export const updateActor = async (actorId: number, actor: apiActor) => {
  // TODO Pre check. Only one creature can be acting
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
      acting: actor.acting,
    },
  });
};

/**
 * Search creatures specifically for the purpose of Adding players OR antagonists to a zone
 * This covers player characters, but ONLY those that are already allocated to the story
 * This covers antagonists. In this case, it doesnt matter that they arent already allocated to the story
 *
 * Relative to this, when adding player characters, its just a case of updating the existing actor row
 * When adding antagonists, its a case of creating a new actor every time, and this time we also allow
 * the user to stipulate a count of actors to add
 *
 * This follows a philosophy
 * Player actors exist persistent through the story
 * Antagonist actors exist only for the duration of the location (...there extras!)
 */
export const searchCreaturesForAddToZone = async (
  storyId: number
): Promise<apiCreature[]> => {
  const deCreatures = await prisma.creature.findMany({
    where: {
      OR: [
        {
          AND: [
            {
              type: 'PLAYER',
              actors: {
                some: {
                  storyId: storyId,
                },
              },
            },
          ],
        },
        {
          type: 'ANTAGONIST',
        },
      ],
    },
    include: creatureInclude,
  });

  return deCreatures.map((deCreature) => {
    return mapDeCreatureToApiCreature(deCreature);
  });
};
