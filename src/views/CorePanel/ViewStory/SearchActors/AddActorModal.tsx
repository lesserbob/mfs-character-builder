import { useCallback, useEffect, useState } from 'react';
import { Creature } from '../../../../api/generated';
import { apiClient } from '../../../../api/client';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import './AddActorModal.css';

export interface AddActorModalProps {
  isModalOpen: boolean;
  closeModal(): void;
  storyId: number;
  zoneId?: number;
}

export const AddActorModal = ({
  isModalOpen,
  closeModal,
  storyId,
  zoneId,
}: AddActorModalProps) => {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [selectedCreatures, setSelectedCreatures] = useState<number[]>([]);
  const [selectedCreatureCount, setSelectedCreatureCount] = useState<
    Map<number, number>
  >(new Map());
  const addingToZone = !!zoneId;

  const fetchCreatures = useCallback(() => {
    const call = addingToZone
      ? apiClient.getCreaturesForStory(storyId)
      : apiClient.getCreatures('PLAYER');

    return call
      .then((response) => {
        setCreatures(response.data);
      })
      .catch((error) => {
        console.error('Error fetching creatures:', error);
      });
  }, [zoneId]);

  useEffect(() => {
    fetchCreatures();
  }, [fetchCreatures, storyId, zoneId]);

  const setIsSelected = (creatureId: number, selected: boolean) => {
    if (selected) {
      setSelectedCreatures([...selectedCreatures, creatureId]);
    } else {
      setSelectedCreatures(selectedCreatures.filter((sc) => sc != creatureId));
    }
  };

  const setSelectedCount = (creatureId: number, count: number) => {
    setSelectedCreatureCount((prev) => {
      const updated = new Map(prev);
      updated.set(creatureId, count);
      return updated;
    });
  };

  // Make sure we are clearing state data on dialog close
  useEffect(() => {
    if (!isModalOpen) {
      setSelectedCreatureCount(new Map());
      setSelectedCreatures([]);
    }
  }, [isModalOpen]);

  const onSave = async () => {
    await apiClient.addActors(
      storyId,
      selectedCreatures.map((sc) => {
        return { creatureId: sc, count: selectedCreatureCount.get(sc), zoneId };
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
                    {addingToZone && <TableCell>Count</TableCell>}
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
                      {addingToZone && creature.type === 'ANTAGONIST' && (
                        <TableCell>
                          <TextField
                            variant="standard"
                            size="small"
                            type="number"
                            defaultValue={1}
                            disabled={!selectedCreatures.includes(creature.id)}
                            onChange={(e) =>
                              setSelectedCount(
                                creature.id,
                                Number(e.target.value)
                              )
                            }
                          />
                        </TableCell>
                      )}
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
