import React from 'react';
import { Drawer, Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OptionPanel = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useAuth();

  const handleCreateNew = () => {
    navigate('/create');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleSearchCreatures = () => {
    navigate('/search');
  };

  const handleSearchItems = () => {
    navigate('/search-items');
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          Character Builder
        </Typography>
      </Box>
      <Stack spacing={2} sx={{ p: 2 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Characters
          </Typography>
          <Stack spacing={1} sx={{ ml: 2 }}>
            <Button
              variant={location.pathname === '/' ? 'contained' : 'text'}
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
              onClick={handleHome}
            >
              Home
            </Button>
            <Button
              variant={location.pathname === '/create' ? 'contained' : 'text'}
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
              onClick={handleCreateNew}
              disabled={!isAuthenticated}
            >
              Create New
            </Button>
            <Button
              variant={location.pathname === '/search' ? 'contained' : 'text'}
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
              onClick={handleSearchCreatures}
              disabled={!isAuthenticated}
            >
              Search Creatures
            </Button>
          </Stack>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Gear
          </Typography>
          <Stack spacing={1} sx={{ ml: 2 }}>
            <Button
              variant={
                location.pathname === '/search-items' ? 'contained' : 'text'
              }
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
              onClick={handleSearchItems}
              disabled={!isAuthenticated}
            >
              Search Items
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );
};

export default OptionPanel;
