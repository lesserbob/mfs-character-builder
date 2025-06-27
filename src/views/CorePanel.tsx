import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import OptionPanel from './OptionPanel';
import CreateCreature from './CorePanel/CreateCreature';
import ViewCreature from './CorePanel/ViewCreature';
import { LandingPage } from './LandingPage';
import SearchCreatures from './CorePanel/SearchCreatures';
import LevelUpCreature from './CorePanel/LevelUpCreature';

export const CorePanel = (): React.JSX.Element => {
  return (
    <div>
      <OptionPanel />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: '240px',
          padding: 3,
        }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<CreateCreature />} />
          <Route path="/creature/:id" element={<ViewCreature />} />
          <Route path="/search" element={<SearchCreatures />} />
          <Route path="/levelup/:id/:level" element={<LevelUpCreature />} />
        </Routes>
      </Box>
    </div>
  );
};
