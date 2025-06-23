import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { apiClient } from '../../api/client';
import { Creature } from '../../api/generated';

interface ViewCreatureProps {
  creatureId: number;
}

const ViewCreature: React.FC<ViewCreatureProps> = ({ creatureId }) => {
  const [creature, setCreature] = useState<Creature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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

  const totalStats = (creature.might || 0) + (creature.agility || 0) + (creature.intellect || 0) + (creature.spirit || 0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {creature.name}
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Level:</strong> {creature.level}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Total Stats:</strong> {totalStats}
              </Typography>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Statistics
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={`Might: ${creature.might || 0}`} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={`Agility: ${creature.agility || 0}`} 
                    color="secondary" 
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={`Intellect: ${creature.intellect || 0}`} 
                    color="success" 
                    variant="outlined"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={`Spirit: ${creature.spirit || 0}`} 
                    color="warning" 
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Stat Distribution
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {creature.might || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Might
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                {creature.agility || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Agility
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {creature.intellect || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intellect
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {creature.spirit || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Spirit
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewCreature;
