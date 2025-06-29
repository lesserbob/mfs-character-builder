import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { setAuthToken } from '../api/client';
import { authService } from '../api/authService';

interface User {
  id: number;
  username: string;
  type?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('authToken')
  );

  useEffect(() => {
    // Set token in API client if it exists
    if (token) {
      setAuthToken(token);
      // Try to get current user
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser(token!);
      setUser(response.user);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      // Token might be invalid, clear it
      logout();
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await authService.login({ username, password });
      const { token: newToken, user: userData } = response;

      setToken(newToken);
      setUser(userData);
      setAuthToken(newToken);
      localStorage.setItem('authToken', newToken);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await authService.register({ username, password });
      const { token: newToken, user: userData } = response;

      setToken(newToken);
      setUser(userData);
      setAuthToken(newToken);
      localStorage.setItem('authToken', newToken);

      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken('');
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
