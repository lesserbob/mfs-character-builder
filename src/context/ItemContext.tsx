import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { apiClient } from '../api/client';
import { Item } from '../api/generated';

interface ItemContextType {
  items: Item[];
  loading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  refreshItems: () => Promise<void>;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

interface ItemProviderProps {
  children: ReactNode;
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    if (items.length > 0) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getItems();
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const refreshItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getClasses();
      setItems(response.data);
    } catch (err) {
      setError('Failed to refresh classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const value: ItemContextType = {
    items,
    loading,
    error,
    fetchItems,
    refreshItems,
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};

export const useItems = (): ItemContextType => {
  const context = useContext(ItemContext);
  if (context === undefined) {
    throw new Error('useItems must be used within a ItemsProvider');
  }
  return context;
};
