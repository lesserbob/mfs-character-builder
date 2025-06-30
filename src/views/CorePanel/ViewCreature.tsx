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
      <div ref={contentRef} style={{ padding: '10px' }}>
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
            <CreatureDerivedStatBlock creature={creature} />
          </Grid>
        </Grid>
        <Box sx={{ py: 2 }}>
          <CreatureAbiltities creature={creature} />
        </Box>
        <Box sx={{ py: 2 }}>
          <FeatureSelectionPanel creature={creature} />
        </Box>
      </div>
      <div className="view-creature-button-group">
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() =>
              navigate(`/levelup/${creatureId}/${creature.level + 1}`)
            }
            sx={{ flex: 1 }}
          >
            Level Up
          </Button>
          <Button
            variant="outlined"
            onClick={handleExportPdf}
            disabled={pdfLoading}
            sx={{ flex: 1 }}
          >
            {pdfLoading ? 'Generating PDF...' : 'Export PDF'}
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export default ViewCreature;
