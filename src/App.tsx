import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CorePanel } from './views/CorePanel';
import { ClassProvider } from './context/ClassContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ItemProvider } from './context/ItemContext';

const AppContent: React.FC = () => {
  // const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   return <LoginForm />;
  // }

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
      <AppContent />
    </AuthProvider>
  );
}

export default App;
