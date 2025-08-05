import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../../../api/client';
import { Typography } from '@mui/material';
import { Stage, Layer, Rect } from 'react-konva';
import {
  LocationProvider,
  useLocation,
} from '../../../../context/LocationContext';
import { GridLayer } from './ViewLocations/GridLayer';
import { TestDraggableLayer } from './ViewLocations/TestDraggableLayer';
import { LocationToolbar } from './ViewLocations/LocationToolbar';
import './ViewLocation.css';
import { ZoneLayer } from './ViewLocations/ZoneLayer';

const ViewLocationInner = ({ locationId }: { locationId: number }) => {
  const { fetchLocation, location } = useLocation();

  useEffect(() => {
    fetchLocation(locationId);
  }, [locationId]);

  return (
    <>
      <Typography variant="h5" component="h2">
        {location?.name}
      </Typography>
      <div className="view-location-toolbar">
        <LocationToolbar />
      </div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <GridLayer />
        <ZoneLayer />
      </Stage>
    </>
  );
};

export const ViewLocation = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const locationId = id ? parseInt(id, 10) : 0;

  return (
    <LocationProvider>
      <ViewLocationInner locationId={locationId} />
    </LocationProvider>
  );
};
