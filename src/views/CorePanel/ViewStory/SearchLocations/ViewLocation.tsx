import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../../../api/client';
import { Typography } from '@mui/material';
import { Stage, Layer, Rect } from 'react-konva';
import {
  LocationProvider,
  useLocation,
} from '../../../../context/LocationContext';
import { GridLayer } from './ViewLocation/GridLayer';
import { LocationToolbar } from './ViewLocation/LocationToolbar';
import './ViewLocation.css';
import { ZoneLayer } from './ViewLocation/ZoneLayer';
import { ActorLayer } from './ViewLocation/ActorLayer';
import { BackgroundLayer } from './ViewLocation/BackgroundLayer';
import { EditActor } from './ViewLocation/EditActor';
import { SimpleAssetModal } from '../../../../components/SimpleAssetModal';

const ViewLocationInner = ({ locationId }: { locationId: number }) => {
  const {
    fetchLocation,
    location,
    promptForNewZone,
    setPromptForNewZone,
    addZone,
  } = useLocation();

  useEffect(() => {
    fetchLocation(locationId);
  }, [locationId]);

  const handleCloseModal = (
    result: { name: string; description: string } | null
  ) => {
    setPromptForNewZone(false);
    if (result) {
      addZone({
        name: result.name,
        description: result.description,
        actors: [],
        xpos: 0,
        ypos: 0,
      });
    }
  };

  return (
    <>
      <EditActor />
      <SimpleAssetModal
        isModalOpen={promptForNewZone}
        assetDescription="New Zone"
        closeModal={handleCloseModal}
      />
      <Typography variant="h5" component="h2">
        {location?.name}
      </Typography>
      <div className="view-location-toolbar">
        <LocationToolbar />
      </div>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <BackgroundLayer />
        <GridLayer />
        <ZoneLayer />
        <ActorLayer />
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
