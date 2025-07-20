import { DefaultApi, Configuration } from './generated';

// Create a configured API client instance
const config = new Configuration({
  basePath: import.meta.env.VITE_API_URL || 'https://localhost:3443/api',
});

// Export the configured API client
export const apiClient = new DefaultApi(config);

// Helper function to set JWT token
export const setAuthToken = (token: string) => {
  config.accessToken = token;
};

// Re-export types for convenience
export type { Creature } from './generated';
