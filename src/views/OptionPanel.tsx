import React from 'react';
import { Drawer, Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OptionPanel.css';

const OptionPanel = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useAuth();

  const handleCreateNewCharacter = () => {
    navigate('/create-character');
  };

  const handleCreateNewAntagonist = () => {
    navigate('/create-antagonist');
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleSearchPlayerCharacter = () => {
    navigate('/search-character');
  };

  const handleSearchAntagonist = () => {
    navigate('/search-antagonist');
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
          <Stack spacing={1}>
            <Button
              variant={location.pathname === '/' ? 'contained' : 'text'}
              fullWidth
              className="option-panel-button"
              onClick={handleHome}
            >
              Home
            </Button>
          </Stack>
          <Typography
            variant="subtitle1"
            className="option-panel-section-title"
          >
            Characters
          </Typography>
          <Stack spacing={1} className="option-panel-stack-inner">
            <Button
              variant={
                location.pathname === '/create-character' ? 'contained' : 'text'
              }
              fullWidth
              className="option-panel-button"
              onClick={handleCreateNewCharacter}
              disabled={!isAuthenticated}
            >
              Create New Character
            </Button>
            <Button
              variant={
                location.pathname === '/search-character' ? 'contained' : 'text'
              }
              fullWidth
              className="option-panel-button"
              onClick={handleSearchPlayerCharacter}
              disabled={!isAuthenticated}
            >
              Search Characters
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
                Antagonist
              </Typography>
              <Stack spacing={1} className="option-panel-stack-inner">
                <Button
                  variant={
                    location.pathname === '/create-antagonist'
                      ? 'contained'
                      : 'text'
                  }
                  fullWidth
                  className="option-panel-button"
                  onClick={handleCreateNewAntagonist}
                  disabled={!isAuthenticated}
                >
                  Create New Antagonist
                </Button>
                <Button
                  variant={
                    location.pathname === '/search-antagonist'
                      ? 'contained'
                      : 'text'
                  }
                  fullWidth
                  className="option-panel-button"
                  onClick={handleSearchAntagonist}
                  disabled={!isAuthenticated}
                >
                  Search Antagonist
                </Button>
              </Stack>
              <Typography
                variant="subtitle1"
                className="option-panel-section-title"
              >
                Admin
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
