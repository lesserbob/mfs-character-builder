import React, { useState, useEffect, useRef } from 'react';
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
import { CreatureDerivedStatBlock } from '../../components/CreatureDerivedStatBlock';
import { CreatureAbiltities } from '../../components/CreatureAbilities';
import { FeatureSelectionPanel } from '../../components/FeatureSelectionPanel';
import { generateCharacterSheetPdf } from '../../util/PdfUtils';

const ViewCreature: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const creatureId = id ? parseInt(id, 10) : 0;
  const { classes, loading: classesLoading } = useClasses();
  const contentRef = useRef<HTMLDivElement>(null);

  const [creature, setCreature] = useState<Creature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

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

  const handleExportPdf = async () => {
    if (!creature || !contentRef.current) return;

    try {
      setPdfLoading(true);
      await generateCharacterSheetPdf(contentRef, creature.name);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setPdfLoading(false);
    }
  };

  // TODO : Should generecise this
  if (loading) {
    return (
      <Box className="view-creature-loading">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="view-creature-alert">
        {error}
      </Alert>
    );
  }

  if (!creature) {
    return (
      <Alert severity="warning" className="view-creature-alert">
        Creature not found
      </Alert>
    );
  }

  return (
    <div>
      <div className="view-creature-button-group">
        <Button
          variant="contained"
          onClick={() =>
            navigate(`/levelup/${creatureId}/${creature.level + 1}`)
          }
          className="view-creature-button"
        >
          Level Up
        </Button>
        <Button
          variant="contained"
          onClick={() => {}}
          className="view-creature-button"
        >
          Change gear
        </Button>
        <Button
          variant="outlined"
          onClick={handleExportPdf}
          disabled={pdfLoading}
          className="view-creature-button"
        >
          {pdfLoading ? 'Generating PDF...' : 'Export PDF'}
        </Button>
      </div>
      <div ref={contentRef} className="view-creature-content">
        <Typography variant="h5" component="h2">
          {creature.name}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Box className="view-creature-stat-block">
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
            <CreatureDerivedStatBlock creature={creature} />
          </Grid>
        </Grid>
        <Box className="view-creature-spacing">
          <CreatureAbiltities creature={creature} />
        </Box>
        <Box className="view-creature-spacing">
          <FeatureSelectionPanel creature={creature} />
        </Box>
      </div>
    </div>
  );
};

export default ViewCreature;
