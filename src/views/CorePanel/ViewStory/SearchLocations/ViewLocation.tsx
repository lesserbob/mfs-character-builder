import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../../../api/client';
import { Location } from '../../../../api/generated';
import { Typography } from '@mui/material';

export const ViewLocation = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const locationId = id ? parseInt(id, 10) : 0;

  const [location, setLocation] = useState<Location>();

  useEffect(() => {
    fetchLocation();
  }, [locationId]);

  const fetchLocation = async () => {
    try {
      const response = await apiClient.getLocationById(locationId);
      setLocation(response.data);
    } catch (err) {
      console.error('Error fetching location:', err);
    }
  };

  return (
    <Typography variant="h5" component="h2">
      {location?.name}
    </Typography>
  );
};
