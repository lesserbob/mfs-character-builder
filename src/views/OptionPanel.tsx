import React from 'react';
import { Drawer, Box, Typography, Button, Stack } from '@mui/material';
import { useCorePanel, CorePanelState } from '../context/CorePanelContext';

const OptionPanel = (): React.JSX.Element => {
  const { currentState, setCurrentState } = useCorePanel();

  const handleCreateNew = () => {
    setCurrentState(CorePanelState.CREATE_CREATURE);
  };

  const handleHome = () => {
    setCurrentState(CorePanelState.LANDING_PAGE);
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
              variant="text"
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
              onClick={handleHome}
            >
              Home
            </Button>
            <Button
              variant="text"
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
              onClick={handleCreateNew}
            >
              Create New
            </Button>
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Stats
          </Typography>
          <Stack spacing={1} sx={{ ml: 2 }}>
            <Button
              variant="text"
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              View All
            </Button>
            <Button
              variant="text"
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              Create New
            </Button>
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Settings
          </Typography>
          <Stack spacing={1} sx={{ ml: 2 }}>
            <Button
              variant="text"
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              Preferences
            </Button>
            <Button
              variant="text"
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              About
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );
};

export default OptionPanel;
