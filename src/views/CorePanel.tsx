import { Box } from '@mui/material';
import OptionPanel from './OptionPanel';
import CreateCreature from './CorePanel/CreateCreature';
import ViewCreature from './CorePanel/ViewCreature';
import { useCorePanel, CorePanelState } from '../context/CorePanelContext';
import { LandingPage } from './LandingPage';

export const CorePanel = (): React.JSX.Element => {
  const { currentState, creatureId } = useCorePanel();

  const renderContent = () => {
    switch (currentState) {
      case CorePanelState.CREATE_CREATURE:
        return <CreateCreature />;
      case CorePanelState.VIEW_CREATURE:
        return creatureId ? <ViewCreature creatureId={creatureId} /> : <LandingPage />;
      case CorePanelState.LANDING_PAGE:
        return <LandingPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div>
      <OptionPanel />
      <Box sx={{ marginLeft: '240px', p: 3 }}>
        {renderContent()}
      </Box>
    </div>
  );
};
