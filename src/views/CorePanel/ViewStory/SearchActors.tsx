import {
  Box,
  IconButton,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';
import { Actor } from '../../../api/generated';
import AddIcon from '@mui/icons-material/Add';
import { AddActorModal } from './SearchActors/AddActorModal';
import { useAuth } from '../../../context/AuthContext';

export interface SearchActorsProps {
  storyId: number;
}

export const SearchActors = ({ storyId }: SearchActorsProps) => {
  const [actors, setActors] = useState<Actor[]>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    fetchActors();
  }, [storyId]);

  const fetchActors = async () => {
    try {
      const response = await apiClient.getActorsByStoryId(storyId);
      setActors(response.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  return (
    <>
      <AddActorModal
        closeModal={() => {
          fetchActors();
          setIsModalOpen(false);
        }}
        isModalOpen={isModalOpen}
        storyId={storyId}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  width: '60px',
                }}
              ></TableCell>
              <TableCell>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  Actors
                  {isAuthenticated && user?.type === 'GM' && (
                    <IconButton
                      onClick={() => setIsModalOpen(true)}
                      color="primary"
                    >
                      <AddIcon />
                    </IconButton>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actors?.map((actor) => (
              <TableRow key={actor.id}>
                <TableCell
                  style={{
                    width: '60px',
                  }}
                >
                  {' '}
                  {actor.creature?.portrait && (
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f9f9f9',
                        backgroundImage: actor.creature?.portrait
                          ? `url(${actor.creature?.portrait})`
                          : undefined,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        position: 'relative',
                        color: '#666',
                      }}
                    />
                  )}
                </TableCell>
                <TableCell>{actor.creature?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
