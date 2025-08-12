/**
 * Core zone layer. Includes box outloine of the zone plus operations and details for the zone
 */

import { Group, Layer, Path, Rect, Text } from 'react-konva';
import {
  DEFAULT_ZONE_WIDTH,
  useLocation,
} from '../../../../../context/LocationContext';
import { Zone } from '../../../../../api/generated';

/*
https://fonts.google.com/icons
Download and look for the pattern in the file d=...
*/
const DELETE_SVG =
  'M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z';
const ADD_ACTOR = 'M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z';

/**
 *
 * @returns Renders the basic zones of a location
 */
export const ZoneLayer = () => {
  const {
    location,
    gridSize,
    updateZone,
    setZonePosition,
    setZoneToAddActorTo,
  } = useLocation();

  const onDragEnd = (e: any, zone: Zone) => {
    const node = e.target;
    const snappedX = Math.round(node.x() / gridSize);
    const snappedY = Math.round(node.y() / gridSize);

    // Only update state if the position changed
    if (snappedX !== zone.xpos || snappedY !== zone.ypos) {
      updateZone({ ...zone, xpos: snappedX, ypos: snappedY });
    }
  };

  const determineRelativeHeight = (zone: Zone): number => {
    return Math.max(
      zone.actors!.filter((actor) => actor.creature!.type === 'PLAYER').length,
      zone.actors!.filter((actor) => actor.creature!.type != 'PLAYER').length
    );
  };

  return (
    <Layer>
      {location?.zones?.map((zone) => (
        <Group
          key={zone.id}
          x={zone.xpos! * gridSize}
          y={zone.ypos! * gridSize}
          draggable
          dragBoundFunc={(pos) => ({
            x: Math.round(pos.x / gridSize) * gridSize,
            y: Math.round(pos.y / gridSize) * gridSize,
          })}
          onDragMove={(e) => {
            const snappedX = Math.round(e.target.x() / gridSize);
            const snappedY = Math.round(e.target.y() / gridSize);

            setZonePosition(zone.id, snappedX, snappedY);
          }}
          onDragEnd={(e) => onDragEnd(e, zone)}
        >
          <Rect
            // These next two are important. Used by drag end when dragging actors
            name="zone"
            id={zone.id.toString()}
            width={DEFAULT_ZONE_WIDTH * gridSize}
            height={(determineRelativeHeight(zone) + 1) * gridSize}
            stroke="black"
            strokeWidth={2}
            cornerRadius={12}
            fill="lightGrey"
          />
          <Rect
            width={DEFAULT_ZONE_WIDTH * gridSize}
            height={20}
            stroke="black"
            cornerRadius={12}
            fill="fill"
          />
          <Text x={4} y={4} text={zone.name} fontSize={12} fill="white" />
          <Path
            data={DELETE_SVG}
            fill="white"
            scale={{ x: 0.02, y: 0.02 }}
            x={DEFAULT_ZONE_WIDTH * gridSize - 20}
            y={20}
            onClick={() => {
              console.log('Delete');
            }}
          />
          <Path
            data={ADD_ACTOR}
            fill="white"
            scale={{ x: 0.02, y: 0.02 }}
            x={DEFAULT_ZONE_WIDTH * gridSize - 40}
            y={20}
            onClick={() => {
              setZoneToAddActorTo(zone);
            }}
          />
        </Group>
      ))}
    </Layer>
  );
};
