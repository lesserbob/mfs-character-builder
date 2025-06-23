import React, { createContext, useContext, useState, ReactNode } from 'react';

export enum CorePanelState {
  CREATE_CREATURE = 'CREATE_CREATURE',
  VIEW_CREATURE = 'VIEW_CREATURE',
  LANDING_PAGE = 'LANDING_PAGE',
}

interface CorePanelContextType {
  currentState: CorePanelState;
  setCurrentState: (state: CorePanelState) => void;
  creatureId?: number;
  setCreatureId: (id: number) => void;
}

const CorePanelContext = createContext<CorePanelContextType | undefined>(undefined);

interface CorePanelProviderProps {
  children: ReactNode;
}

export const CorePanelProvider: React.FC<CorePanelProviderProps> = ({ children }) => {
  const [currentState, setCurrentState] = useState<CorePanelState>(CorePanelState.LANDING_PAGE);
  const [creatureId, setCreatureId] = useState<number | undefined>(undefined);

  const value: CorePanelContextType = {
    currentState,
    setCurrentState,
    creatureId,
    setCreatureId,
  };

  return (
    <CorePanelContext.Provider value={value}>
      {children}
    </CorePanelContext.Provider>
  );
};

export const useCorePanel = (): CorePanelContextType => {
  const context = useContext(CorePanelContext);
  if (context === undefined) {
    throw new Error('useCorePanel must be used within a CorePanelProvider');
  }
  return context;
}; 