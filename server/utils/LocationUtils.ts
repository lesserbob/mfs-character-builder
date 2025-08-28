import { updateActor } from '../service/StoryService';
import { apiActor, apiLocation } from '../types/StoryTypes';

/**
 * When a location update occurs, parse the changes for anything else that might be required
 *
 * @param currentLocation
 * @param newLocation
 */
export function parseLocationUpdate(
  currentLocation: apiLocation,
  newLocation: apiLocation
): apiActor[] {
  // If acting faction has not changed, nothing to see here
  if (currentLocation.actingFaction === newLocation.actingFaction) return [];

  // Check for a change of active faction. This prompts a series of updates to creatures

  let playerActionCount: number | null = null;
  let playerTacSurgeAttempts: number | null = null;
  let playerTacSurgeAllowed: boolean | null = null;
  let antagonistActionCount: number | null = null;
  let antagonistTacSurgeAttempts: number | null = null;
  let antagonistTacSurgeAllowed: boolean | null = null;

  /**
   * null -> PLAYER
   * Players have elected to attack.
   * Set player actions to 1
   * Set antagonist actions to 2
   * Set all Tac Surge Attempts to zero
   * Set all tax surge allows to true
   */
  if (
    !currentLocation.actingFaction &&
    newLocation.actingFaction === 'PLAYER'
  ) {
    console.log('Player start');
    playerActionCount = 1;
    playerTacSurgeAttempts = 0;
    playerTacSurgeAllowed = true;
    antagonistActionCount = 2;
    antagonistTacSurgeAttempts = 0;
    antagonistTacSurgeAllowed = true;
  }

  /**
   * null -> ANTAGONIST
   * Antagonist have elected to attack.
   * Set player actions to 2
   * Set antagonist actions to 1
   * Set all Tac Surge Attempts to zero
   * Set all tax surge allows to true
   */
  if (
    !currentLocation.actingFaction &&
    newLocation.actingFaction === 'ANTAGONIST'
  ) {
    console.log('antag start');

    playerActionCount = 2;
    playerTacSurgeAttempts = 0;
    playerTacSurgeAllowed = true;
    antagonistActionCount = 1;
    antagonistTacSurgeAttempts = 0;
    antagonistTacSurgeAllowed = true;
  }
  /**
   * PLAYER -> ANTAGONIST
   * Player phase ended
   * Set player actions to 2
   * Set player tax surge allows to true
   */
  if (
    currentLocation.actingFaction === 'PLAYER' &&
    newLocation.actingFaction === 'ANTAGONIST'
  ) {
    console.log('Player > antag');

    playerActionCount = 2;
    playerTacSurgeAllowed = true;
  }

  /**
   * ANTAGONIST -> PLAYER
   * Antagonist phase ended
   * Set Antagonist actions to 2
   * Set Antagonist tax surge allows to true
   */
  if (
    currentLocation.actingFaction === 'ANTAGONIST' &&
    newLocation.actingFaction === 'PLAYER'
  ) {
    console.log('antag > player');
    antagonistActionCount = 2;
    antagonistTacSurgeAllowed = true;
  }

  const playerActors: apiActor[] = newLocation.zones
    .flatMap((zone) => zone.actors ?? [])
    .filter((actor): actor is apiActor => actor?.creature?.type === 'PLAYER')
    .map((actor) => {
      return {
        ...actor,
        actionPoints: playerActionCount ?? actor.actionPoints,
        tacticalActionsTaken:
          playerTacSurgeAttempts ?? actor.tacticalActionsTaken,
        tacticalSurgeToken: playerTacSurgeAllowed ?? actor.tacticalSurgeToken,
      };
    });

  playerActors.forEach((actor) => updateActor(actor.id, actor));

  const antagonistActors: apiActor[] = newLocation.zones
    .flatMap((zone) => zone.actors ?? [])
    .filter(
      (actor): actor is apiActor =>
        !!actor && actor.creature?.type === 'ANTAGONIST'
    )
    .map((actor) => {
      return {
        ...actor,
        actionPoints: antagonistActionCount ?? actor.actionPoints,
        tacticalActionsTaken:
          antagonistTacSurgeAttempts ?? actor.tacticalActionsTaken,
        tacticalSurgeToken:
          antagonistTacSurgeAllowed ?? actor.tacticalSurgeToken,
      };
    });

  antagonistActors.forEach((actor) => updateActor(actor.id, actor));

  return [...playerActors, ...antagonistActors];
  //   const updatedLocation: apiLocation = {
  //     ...newLocation,
  //     zones: newLocation.zones.map((zone) => {
  //       return {
  //         ...zone,
  //         actors: zone.actors?.map(
  //           (actor) =>
  //             playerActors.find((pa) => pa.id === actor.id) ??
  //             antagonistActors.find((aa) => aa.id === actor.id) ??
  //             actor
  //         ),
  //       };
  //     }),
  //   };
}
