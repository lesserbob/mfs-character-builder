/*
Context provider for laction map

This is there to allow that all variables related to the map are trackable
such that the layers can all be written in independece whilst sharing common
variable pool

...this is going to get complex
 */

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Actor, Location, Zone, ZoneBase } from '../api/generated';
import { apiClient } from '../api/client';
import { useWebSocket } from './WebSocketContext';

const DEFAULT_GRID_SIZE = 50;
const DEFAULT_MAP_WIDTH = 10;
const DEFAULT_MAP_HEIGHT = 10;

export const DEFAULT_ZONE_WIDTH = 7;
export const DEFAULT_ACTOR_WIDTH = 3;

interface LocationContextType {
  setGridSize(size: number): void;
  gridSize: number;

  setMapWidth(width: number): void;
  mapWidth: number;

  setMapHeight(height: number): void;
  mapHeight: number;

  setPromptForNewZone(newZone: boolean): void;
  promptForNewZone: boolean;

  fetchLocation(locationId: number): void;
  location: Location | undefined;

  addZone(zone: ZoneBase): void;
  updateZone(zone: Zone): void;
  setZonePosition(zoneId: number, xpos: number, ypos: number): void;
  zoneCoordinate: any; // only exposed so components can detect state change
  getZonePosition(zoneId: number): Coordinate;

  setEditActor(actor: Actor | undefined): void;
  editActor: Actor | undefined;
  updateActor(actor: Actor): void;

  zoneToAddActorTo: Zone | undefined;
  setZoneToAddActorTo(zone: Zone | undefined): void;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

interface LocationProviderProps {
  children: ReactNode;
}

export interface Coordinate {
  xpos: number;
  ypos: number;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const [gridSize, setGridSize] = useState<number>(DEFAULT_GRID_SIZE);
  const [mapWidth, setMapWidth] = useState<number>(DEFAULT_MAP_WIDTH);
  const [mapHeight, setMapHeight] = useState<number>(DEFAULT_MAP_HEIGHT);
  const [promptForNewZone, setPromptForNewZone] = useState<boolean>(false);

  const [location, setLocation] = useState<Location>();
  const [editActor, setEditActor] = useState<Actor | undefined>(undefined);

  const { sendMessage, lastMessage } = useWebSocket();

  const [zoneCoordinate, setZoneCoordinate] = useState<Map<number, Coordinate>>(
    new Map()
  );

  const [zoneToAddActorTo, setZoneToAddActorTo] = useState<Zone | undefined>(
    undefined
  );

  const fetchLocation = async (locationId: number) => {
    try {
      const response = await apiClient.getLocationById(locationId);
      setLocation(response.data);
    } catch (err) {
      console.error('Error fetching location:', err);
    }
  };

  const addZone = (zone: ZoneBase) => {
    if (!location) return;

    updateLocation({
      ...location!,
      zones: [...(location!.zones ?? []), { ...zone, id: 1, xpos: 0, ypos: 0 }],
    });
  };

  // Intended to ensure that when anything in location changes it is both retained to
  // the local image of location and that the server is updated
  const updateLocation = async (location: Location) => {
    await apiClient.updateLocation(location.id, location);
    //    fetchLocation(location.id);

    sendMessage({ type: 'refresh_location', payload: location?.id.toString() });
  };

  const updateZone = (zone: Zone) => {
    if (!location) return;

    // we need zone = zones exlucding updated + updated
    updateLocation({
      ...location!,
      zones: [
        ...location!.zones!.filter((ez) => ez.id != zone.id),
        { ...zone },
      ],
    });
  };

  const updateActor = async (actor: Actor) => {
    await apiClient.updateActor(actor?.id!, actor);
    // fetchLocation(location!.id);

    sendMessage({ type: 'refresh_location', payload: location?.id.toString() });
  };

  /**
   * Update in respone to a location change
   */
  useEffect(() => {
    if (!location) return;
    if (!lastMessage) return;

    if (
      lastMessage.type === 'refresh_location' &&
      Number(lastMessage.payload) === location.id
    ) {
      fetchLocation(location.id);
    }
  }, [lastMessage]); // NOTE : Dont add location. It creates an infinite loop

  /**
   * This set TEMP zone position.
   * Intended to avoid visual quirks while dragging zone
   */
  const setZonePosition = (zoneId: number, xpos: number, ypos: number) => {
    // Calm down the refreshes. Only set state when change detected
    const existingTempCoordinate = zoneCoordinate.get(zoneId);
    if (
      existingTempCoordinate &&
      existingTempCoordinate.xpos == xpos &&
      existingTempCoordinate.ypos == ypos
    )
      return;

    const newCoordinate = { xpos: xpos, ypos: ypos };
    setZoneCoordinate((prev) => {
      const newMap = new Map(prev);
      newMap.set(zoneId, newCoordinate);
      return newMap;
    });
  };

  const getZonePosition = (zoneId: number): Coordinate => {
    if (zoneCoordinate.has(zoneId)) return zoneCoordinate.get(zoneId)!;
    const zone = location?.zones?.find((z) => z.id === zoneId);
    return { xpos: zone?.xpos!, ypos: zone?.ypos! };
  };

  const value: LocationContextType = {
    setGridSize,
    gridSize,

    setMapWidth,
    mapWidth,

    setMapHeight,
    mapHeight,

    setPromptForNewZone,
    promptForNewZone,

    fetchLocation,
    location,

    addZone,
    updateZone,
    setZonePosition,
    zoneCoordinate,
    getZonePosition,

    setEditActor,
    editActor,
    updateActor,

    zoneToAddActorTo,
    setZoneToAddActorTo,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
