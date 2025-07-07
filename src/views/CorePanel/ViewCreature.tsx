import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
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
import { CreatureGear } from './ViewCreature/CreatureGear';

const ViewCreature: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const creatureId = id ? parseInt(id, 10) : 0;
  const { classes, loading: classesLoading } = useClasses();
  const contentRef = useRef<HTMLDivElement>(null);

  const [creature, setCreature] = useState<Creature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleLevelUp = () => {
    handleMenuClose();
    navigate(`/levelup/${creatureId}/${creature!.level + 1}`);
  };

  const handleChangeGear = () => {
    handleMenuClose();
    navigate(`/shopping/${creatureId}`);
  };

  const handleExportPdfFromMenu = () => {
    handleMenuClose();
    handleExportPdf();
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton onClick={handleMenuOpen} sx={{ color: 'primary.main' }}>
          <SettingsIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleLevelUp}>Level Up</MenuItem>
          <MenuItem onClick={handleChangeGear}>Change Gear</MenuItem>
          <MenuItem onClick={handleExportPdfFromMenu} disabled={pdfLoading}>
            {pdfLoading ? 'Generating PDF...' : 'Export PDF'}
          </MenuItem>
        </Menu>
      </Box>
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
        <Box className="view-creature-spacing">
          <CreatureGear creature={creature} />
        </Box>
      </div>
    </div>
  );
};

export default ViewCreature;
