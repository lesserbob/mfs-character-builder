import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CorePanel } from './views/CorePanel';
import { ClassProvider } from './context/ClassContext';

function App() {
  return (
    <ClassProvider>
      <Router>
        <CorePanel />
      </Router>
    </ClassProvider>
  );
}

export default App;
