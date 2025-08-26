import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CorePanel } from './views/CorePanel';
import { ClassProvider } from './context/ClassContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ItemProvider } from './context/ItemContext';
import { WebSocketProvider } from './context/WebSocketContext';

const AppContent: React.FC = () => {
  return (
    <ClassProvider>
      <ItemProvider>
        <Router>
          <CorePanel />
        </Router>
      </ItemProvider>
    </ClassProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <AppContent />
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
