import { useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { apiClient } from './api/client';
import OptionPanel from './views/OptionPanel';
import CreateCreature from './views/CorePanel/CreateCreature';
import { CorePanel } from './views/CorePanel';
import { CorePanelProvider } from './context/CorePanelContext';

function App() {
  const [creature, setCreature] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCreature = () => {
    setLoading(true);
    return apiClient
      .getCreatureById(1)
      .then((response) => {
        console.log(creature);
        setCreature(response.data);
      })
      .catch((error) => {
        console.error('Error fetching creature:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <CorePanelProvider>
      <CorePanel />
      {/* <OptionPanel />
      <Box sx={{ marginLeft: '240px', p: 3 }}>
      <div>
          <Button 
            variant="contained" 
            onClick={fetchCreature}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Creature (ID: 1)'}
          </Button>
          {creature && (
            <div style={{ marginTop: '20px' }}>
              <h3>Creature Data:</h3>
              <pre>{JSON.stringify(creature, null, 2)}</pre>
      </div>
          )}
      </div>

        <CreateCreature />
      </Box> */}
    </CorePanelProvider>
  );
}

export default App;
