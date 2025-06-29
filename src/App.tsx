import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CorePanel } from './views/CorePanel';
import { ClassProvider } from './context/ClassContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';

const AppContent: React.FC = () => {
  // const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   return <LoginForm />;
  // }

  return (
    <ClassProvider>
      <Router>
        <CorePanel />
      </Router>
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
