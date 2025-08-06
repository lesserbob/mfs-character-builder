/**
 * Renders actors onto a layer
 */

import { Group, Image, Layer, Rect, Text } from 'react-konva';
import {
  DEFAULT_ACTOR_WIDTH,
  useLocation,
} from '../../../../../context/LocationContext';
import { useEffect, useState } from 'react';
import { Actor } from '../../../../../api/generated';
import {
  getHealth,
  getRemainingEndurance,
  getRemainingHealth,
  getRemainingMomentum,
} from '../../../../../util/CreatureUtils';
import { useClasses } from '../../../../../context/ClassContext';

interface ActorGroup {
  xpos: number;
  ypos: number;
  actors: Actor[];
}

const PADDING = 0.05;
const HP_BAR_HEIGHT_MULTIPLIER = 0.1;

const preloadImages = (
  urls: string[]
): Promise<Map<string, HTMLImageElement>> => {
  const map = new Map<string, HTMLImageElement>();

  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new window.Image();
          img.src = url;
          img.onload = () => {
            map.set(url, img);
            resolve();
          };
        })
    )
  ).then(() => map);
};

export const ActorLayer = () => {
  const { gridSize, location, setEditActor } = useLocation();
  const { classes } = useClasses();

  const [actorGroups, setActorGroups] = useState<ActorGroup[]>();

  const [hovered, setHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [lastHoveredActor, setLastHoveredActor] = useState<Actor | undefined>(
    undefined
  );

  // Pre cached images by url
  const [imageMap, setImageMap] = useState<Map<string, HTMLImageElement>>(
    new Map()
  );

  // When location changes, build list of pro and ant agonist
  useEffect(() => {
    // for each zone we need 2 actor groups
    // One for pro, one for ant
    // Per group
    // Pro xpos = Normal X of zone (zoneX * gridSize)
    // Ant xpos = Normal X of zone (zoneX * gridSize) + (DEFAULT_ACTOR_WIDTH+1 * grid size)
    // ypos = Normal Y of zone (zoneY * gridSize) + 50% of gridSize [thats half a grid plus a inlay]
    const ag: ActorGroup[] = [];
    if (location) {
      for (const zone of location?.zones!) {
        const pro = {
          xpos: zone.xpos * gridSize,
          ypos: zone.ypos * gridSize + gridSize * 0.5,
          actors: zone.actors.filter((a) => a.creature?.type === 'PLAYER'),
        };
        ag.push(pro);

        const ant = {
          xpos: zone.xpos * gridSize + (DEFAULT_ACTOR_WIDTH + 1) * gridSize,
          ypos: zone.ypos * gridSize + gridSize * 0.5,
          actors: zone.actors.filter((a) => a.creature?.type === 'ANTAGONIST'),
        };
        ag.push(ant);
      }
    }

    // Build map of images by url
    const urls = location
      ? (Array.from(
          new Set(
            location!.zones
              ?.flatMap((z) => z.actors)
              .map((a) => a?.creature!.portrait)
              .filter((url) => typeof url === 'string')
          )
        ) ?? [])
      : [];
    preloadImages(urls).then(setImageMap);

    setActorGroups(ag);
  }, [location, gridSize]);

  const hpBarHeight = HP_BAR_HEIGHT_MULTIPLIER * gridSize;
  const healthOuterBarWidth =
    (DEFAULT_ACTOR_WIDTH - 1) * gridSize - gridSize * PADDING * 3;
  const healthOuterBarHeight = hpBarHeight - PADDING * 2;

  const healthInnerBarXPos = gridSize + PADDING * gridSize + 1;
  const healthInnerBarWidth = healthOuterBarWidth - 2; // i.e. 1 pixel in
  const healthInnerBarHeight = healthOuterBarHeight - 2;

  const fontSize = gridSize * 0.2;

  const composeCharacterInformation = (actor: Actor): string => {
    return (
      actor.creature?.name +
      '\n' +
      'Health: ' +
      getRemainingHealth(actor, classes).toString() +
      '/' +
      getHealth(actor.creature!, classes).toString() +
      '\n' +
      'Endurance: ' +
      getRemainingEndurance(actor, classes).toString() +
      '/' +
      getHealth(actor.creature!, classes).toString() +
      '\n' +
      'Momentum: ' +
      getRemainingMomentum(actor).toString() +
      '\n' +
      'Action points: ' +
      actor.actionPoints
    );
  };

  return (
    <Layer>
      {actorGroups?.map((ag, index) => (
        <Group key={index} x={ag.xpos} y={ag.ypos}>
          {ag.actors.map((actor, index) => (
            <Group x={0} y={index * gridSize}>
              <Rect
                key={1000 + actor.id}
                x={gridSize * PADDING}
                y={gridSize * PADDING}
                width={DEFAULT_ACTOR_WIDTH * gridSize - gridSize * PADDING * 2}
                height={gridSize - gridSize * PADDING * 2}
                stroke="black"
                strokeWidth={1}
                fill="transparent"
              />
              {actor.creature?.portrait && (
                <Image
                  image={imageMap.get(actor.creature?.portrait)}
                  x={PADDING * gridSize * 2}
                  y={PADDING * gridSize * 2}
                  width={gridSize - gridSize * PADDING * 4}
                  height={gridSize - gridSize * PADDING * 4}
                  onMouseEnter={(e) => {
                    setLastHoveredActor(actor);
                    setHovered(true);
                    const stage = e.target.getStage();
                    const pointerPos = stage?.getPointerPosition();
                    if (pointerPos) setTooltipPos(pointerPos);
                  }}
                  onMouseMove={(e) => {
                    const stage = e.target.getStage();
                    const pointerPos = stage?.getPointerPosition();
                    if (pointerPos) setTooltipPos(pointerPos);
                  }}
                  onMouseLeave={() => setHovered(false)}
                  onDblClick={() => {
                    setEditActor(actor);
                  }}
                />
              )}
              <Rect
                x={gridSize + PADDING * gridSize}
                y={PADDING * gridSize * 2}
                width={healthOuterBarWidth}
                height={healthOuterBarHeight}
                stroke="black"
                strokeWidth={1}
                fill="transparent"
              />
              <Rect
                x={healthInnerBarXPos}
                y={PADDING * gridSize * 2 + 1}
                width={
                  healthInnerBarWidth *
                  (getRemainingHealth(actor, classes) /
                    getHealth(actor.creature!, classes)) *
                  0.5
                }
                height={healthInnerBarHeight}
                fill="red"
              />
              <Rect
                x={
                  healthInnerBarXPos +
                  healthInnerBarWidth *
                    (getRemainingHealth(actor, classes) /
                      getHealth(actor.creature!, classes)) *
                    0.5
                }
                y={PADDING * gridSize * 2 + 1}
                width={
                  healthInnerBarWidth *
                  (getRemainingEndurance(actor, classes) /
                    getHealth(actor.creature!, classes)) *
                  0.5
                }
                height={hpBarHeight - PADDING * 2 - 2}
                fill="green"
              />
              <Text
                x={gridSize + gridSize * PADDING}
                y={hpBarHeight + gridSize * PADDING * 2}
                width={
                  gridSize * (DEFAULT_ACTOR_WIDTH - 1) + gridSize * PADDING * 4
                }
                text={actor.creature!.name}
                fontSize={fontSize}
              />
            </Group>
          ))}
        </Group>
      ))}
      {hovered && lastHoveredActor && (
        <Group x={tooltipPos.x + 10} y={tooltipPos.y + 10}>
          <Rect
            width={200}
            height={100}
            fill="black"
            opacity={0.8}
            cornerRadius={4}
          />
          <Text
            text={composeCharacterInformation(lastHoveredActor)}
            fill="white"
            padding={5}
            fontSize={14}
            width={200}
            height={100}
          />
        </Group>
      )}
    </Layer>
  );
};
