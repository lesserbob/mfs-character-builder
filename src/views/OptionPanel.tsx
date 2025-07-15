import React from 'react';
import { Drawer, Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OptionPanel.css';

const OptionPanel = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useAuth();

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

  const handleResetPasssord = () => {
    navigate('/reset-password');
  };

  return (
    <Drawer variant="permanent" anchor="left" className="option-panel-drawer">
      <Box className="option-panel-box">
        <Typography variant="h6" component="div">
          Character Builder
        </Typography>
      </Box>
      <Stack spacing={2} className="option-panel-stack">
        <Box>
          <Typography
            variant="subtitle1"
            className="option-panel-section-title"
          >
            Characters
          </Typography>
          <Stack spacing={1} className="option-panel-stack-inner">
            <Button
              variant={location.pathname === '/' ? 'contained' : 'text'}
              fullWidth
              className="option-panel-button"
              onClick={handleHome}
            >
              Home
            </Button>
            <Button
              variant={location.pathname === '/create' ? 'contained' : 'text'}
              fullWidth
              className="option-panel-button"
              onClick={handleCreateNew}
              disabled={!isAuthenticated}
            >
              Create New
            </Button>
            <Button
              variant={location.pathname === '/search' ? 'contained' : 'text'}
              fullWidth
              className="option-panel-button"
              onClick={handleSearchCreatures}
              disabled={!isAuthenticated}
            >
              Search Creatures
            </Button>
          </Stack>
          <Typography
            variant="subtitle1"
            className="option-panel-section-title"
          >
            Gear
          </Typography>
          <Stack spacing={1} className="option-panel-stack-inner">
            <Button
              variant={
                location.pathname === '/search-items' ? 'contained' : 'text'
              }
              fullWidth
              className="option-panel-button"
              onClick={handleSearchItems}
              disabled={!isAuthenticated}
            >
              Search Items
            </Button>
          </Stack>
          {isAuthenticated && user?.type === 'GM' && (
            <>
              <Typography
                variant="subtitle1"
                className="option-panel-section-title"
              >
                GM Only
              </Typography>
              <Stack spacing={1} className="option-panel-stack-inner">
                <Button
                  variant={
                    location.pathname === '/reset-password'
                      ? 'contained'
                      : 'text'
                  }
                  fullWidth
                  className="option-panel-button"
                  onClick={handleResetPasssord}
                >
                  Reset Passwords
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Stack>
    </Drawer>
  );
};

export default OptionPanel;
