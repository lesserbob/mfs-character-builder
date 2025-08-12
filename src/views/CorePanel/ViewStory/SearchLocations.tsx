import { useEffect, useState } from 'react';
import { Location } from '../../../api/generated';
import { apiClient } from '../../../api/client';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { SimpleAssetModal } from '../../../components/SimpleAssetModal';

interface SearchLocationsProps {
  storyId: number;
}

export const SearchLocations = ({ storyId }: SearchLocationsProps) => {
  const [locations, setLocations] = useState<Location[]>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchLocations();
  }, [storyId]);

  const fetchLocations = async () => {
    try {
      const response = await apiClient.getLocationsByStoryId(storyId);
      setLocations(response.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  const handleCloseModal = async (
    result: { name: string; description: string } | null
  ) => {
    setIsModalOpen(false);
    if (result) {
      await apiClient.createLocation(storyId, {
        name: result.name,
        description: result.description,
      });

      fetchLocations();
    }
  };

  return (
    <>
      <SimpleAssetModal
        isModalOpen={isModalOpen}
        closeModal={handleCloseModal}
        assetDescription={'Location'}
      ></SimpleAssetModal>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  Locations
                  <IconButton
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations?.map((location) => (
              <TableRow key={location.id}>
                <TableCell>
                  <Link
                    to={`/view-location/${location.id}`}
                    className="location-link"
                  >
                    {location.name}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
