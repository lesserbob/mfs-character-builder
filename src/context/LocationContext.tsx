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

  fetchLocation(locationId: number): void;
  location: Location | undefined;

  addZone(zone: ZoneBase): void;
  updateZone(zone: Zone): void;

  setEditActor(actor: Actor | undefined): void;
  editActor: Actor | undefined;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const [gridSize, setGridSize] = useState<number>(DEFAULT_GRID_SIZE);
  const [mapWidth, setMapWidth] = useState<number>(DEFAULT_MAP_WIDTH);
  const [mapHeight, setMapHeight] = useState<number>(DEFAULT_MAP_HEIGHT);
  const [location, setLocation] = useState<Location>();
  const [editActor, setEditActor] = useState<Actor | undefined>(undefined);

  const fetchLocation = async (locationId: number) => {
    try {
      const response = await apiClient.getLocationById(locationId);
      setLocation(response.data);
    } catch (err) {
      console.error('Error fetching location:', err);
    }
  };

  // TODO for testing...remove
  // useEffect(() => {
  //   console.log(location);
  // }, [location]);

  const addZone = (zone: ZoneBase) => {
    // TODO Probably want to push this to server, the re-treive the location
    // For now, just insert into location
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
    fetchLocation(location.id);
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

  const value: LocationContextType = {
    setGridSize,
    gridSize,

    setMapWidth,
    mapWidth,

    setMapHeight,
    mapHeight,

    fetchLocation,
    location,

    addZone,
    updateZone,

    setEditActor,
    editActor,
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
