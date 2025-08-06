import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Link,
  TableBody,
  Checkbox,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../../../api/client';
import { Actor, Creature } from '../../../api/generated';
import AddIcon from '@mui/icons-material/Add';
import './SearchActors.css';

/**
 * Modal to allow the selection of creatures to be added as actors
 */
export interface AddActorModalProps {
  isModalOpen: boolean;
  closeModal(): void;
  storyId: number;
}

const AddActorModal = ({
  isModalOpen,
  closeModal,
  storyId,
}: AddActorModalProps) => {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [selectedCreatures, setSelectedCreatures] = useState<number[]>([]);

  const fetchCreatures = useCallback(() => {
    return (
      apiClient
        // Player for now, as we are adding players to the story
        // However, later, I want (within a zone) to be able to create an actor based on an antagonist
        // and drop them directly into a zone
        // Therefore, when dropping into a zone, this list would be PLAYERS in story + list of all ANTAGONIST creatures
        .getCreatures('PLAYER')
        .then((response) => {
          setCreatures(response.data);
        })
        .catch((error) => {
          console.error('Error fetching creatures:', error);
        })
    );
  }, []);

  useEffect(() => {
    fetchCreatures();
  }, [fetchCreatures]);

  const setIsSelected = (creatureId: number, selected: boolean) => {
    if (selected) {
      setSelectedCreatures([...selectedCreatures, creatureId]);
    } else {
      setSelectedCreatures(selectedCreatures.filter((sc) => sc != creatureId));
    }
  };

  const onSave = async () => {
    await apiClient.addActors(
      storyId,
      selectedCreatures.map((sc) => {
        return { creatureId: sc, count: 1 };
      })
    );

    closeModal();
  };

  return (
    <Dialog
      open={isModalOpen}
      slotProps={{
        paper: {
          className: 'search-actor-modal-dialog-paper',
        },
      }}
    >
      <DialogTitle>Add Actors</DialogTitle>
      <DialogContent>
        <div className="search-actor-modal-stack">
          <div className="search-actor-modal-wrapper">
            <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
              <Table stickyHeader className="mui-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Include</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {creatures.map((creature, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{creature.name}</TableCell>
                      <TableCell>
                        <Checkbox
                          onChange={(e) => {
                            setIsSelected(creature.id, e.target.checked);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="search-actor-modal-button-group">
            <Button
              type="button"
              variant="contained"
              fullWidth
              onClick={() => {
                onSave();
              }}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => {
                closeModal();
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export interface SearchActorsProps {
  storyId: number;
}

export const SearchActors = ({ storyId }: SearchActorsProps) => {
  const [actors, setActors] = useState<Actor[]>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
        closeModal={() => setIsModalOpen(false)}
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
                  <IconButton
                    onClick={() => setIsModalOpen(true)}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actors?.map((actor) => (
              <TableRow>
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
