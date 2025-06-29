import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { apiClient } from '../api/client';
import { Class } from '../api/generated';

interface ClassContextType {
  classes: Class[];
  loading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
  refreshClasses: () => Promise<void>;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider: React.FC<ClassProviderProps> = ({ children }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log('yea');
  const fetchClasses = async () => {
    if (classes.length > 0) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getClasses();
      console.log(response.data);
      setClasses(response.data);
    } catch (err) {
      setError('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const refreshClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getClasses();
      setClasses(response.data);
    } catch (err) {
      setError('Failed to refresh classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const value: ClassContextType = {
    classes,
    loading,
    error,
    fetchClasses,
    refreshClasses,
  };

  return (
    <ClassContext.Provider value={value}>{children}</ClassContext.Provider>
  );
};

export const useClasses = (): ClassContextType => {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error('useClasses must be used within a ClassProvider');
  }
  return context;
};
