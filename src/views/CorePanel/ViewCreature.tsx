import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Stack,
  Button,
} from '@mui/material';
import { apiClient } from '../../api/client';
import { Creature } from '../../api/generated';
import { ReadOnlyField } from './ViewCreature/ReadOnlyField';
import './ViewCreature.css';
import { useClasses } from '../../context/ClassContext';
import { getClassDescription } from '../../util/CreatureUtils';
import { CharacterCapabilities } from '../../components/CharacterCapabilities';

const ViewCreature: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const creatureId = id ? parseInt(id, 10) : 0;
  const { classes, loading: classesLoading } = useClasses();

  const [creature, setCreature] = useState<Creature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCreature();
  }, [creatureId]);

  const fetchCreature = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getCreatureById(creatureId);
      setCreature(response.data);
    } catch (err) {
      console.error('Error fetching creature:', err);
      setError('Failed to load creature data');
    } finally {
      setLoading(false);
    }
  };

  // TODO : Should generecise this
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!creature) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Creature not found
      </Alert>
    );
  }

  return (
    <div>
      <Typography variant="h5" component="h2">
        {creature.name}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'grey.400',
              borderRadius: 1,
              padding: 2,
            }}
          >
            <Stack spacing={2}>
              <ReadOnlyField label="Name" value={creature.name} />
              <ReadOnlyField
                label="Level"
                value={
                  creature.level.toString() +
                  ' ' +
                  getClassDescription(creature, classes)
                }
              />
              <ReadOnlyField
                label="Might"
                value={creature.might?.toString() ?? '0'}
              />
              <ReadOnlyField
                label="Agility"
                value={creature.agility?.toString() ?? '0'}
              />
              <ReadOnlyField
                label="Intellect"
                value={creature.intellect?.toString() ?? '0'}
              />
              <ReadOnlyField
                label="Spirit"
                value={creature.spirit?.toString() ?? '0'}
              />
            </Stack>
          </Box>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <CharacterCapabilities creature={creature} />
        </Grid>
      </Grid>
      <div className="view-creature-button-group">
        <Button
          variant="contained"
          fullWidth
          onClick={() =>
            navigate(`/levelup/${creatureId}/${creature.level + 1}`)
          }
        >
          Level Up
        </Button>
      </div>
    </div>
  );
};

export default ViewCreature;
