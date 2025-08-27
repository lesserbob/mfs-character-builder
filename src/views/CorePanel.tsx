import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import OptionPanel from './OptionPanel';
import CreateCreature from './CorePanel/CreateCreature';
import ViewCreature from './CorePanel/ViewCreature';
import { LandingPage } from './LandingPage';
import SearchCreatures from './CorePanel/SearchCreatures';
import LevelUpCreature from './CorePanel/LevelUpCreature';
import SearchItems from './CorePanel/SearchItems';
import Shopping from './CorePanel/Shopping';
import { ResetPassword } from './CorePanel/ResetPassword';
import { CreatePlayerCharacter } from './CorePanel/CreatePlayerCharacter';
import { CreateAntagonist } from './CorePanel/CreateAntagonist';
import { SearchStories } from './CorePanel/SearchStories';
import { CreateStory } from './CorePanel/CreateStory';
import { ViewStory } from './CorePanel/ViewStory';
import { ViewLocation } from './CorePanel/ViewStory/SearchLocations/ViewLocation';

export const CorePanel = (): React.JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  return (
    <div>
      <OptionPanel onDrawerStateChange={setIsDrawerOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: isDrawerOpen ? '240px' : '80px',
          padding: 3,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-character" element={<CreatePlayerCharacter />} />
          <Route path="/create-antagonist" element={<CreateAntagonist />} />
          <Route path="/creature/:id" element={<ViewCreature />} />
          <Route
            path="/search-character"
            element={<SearchCreatures type={'PLAYER'} />}
          />
          <Route
            path="/search-antagonist"
            element={<SearchCreatures type={'ANTAGONIST'} />}
          />
          {/* NQR. Level should be a query parmaeter, not in the path */}
          <Route path="/levelup/:id/:level" element={<LevelUpCreature />} />
          <Route path="/search-items" element={<SearchItems />} />
          <Route path="/shopping/:id" element={<Shopping />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/search-stories" element={<SearchStories />} />
          <Route path="/create-story" element={<CreateStory />} />
          <Route path="/view-story/:id" element={<ViewStory />} />
          <Route path="/view-location/:id" element={<ViewLocation />} />
        </Routes>
      </Box>
    </div>
  );
};
