import { DefaultApi, Configuration } from './generated';

// Create a configured API client instance
const config = new Configuration({
  basePath: 'http://localhost:3001/api',
});

// Export the configured API client
export const apiClient = new DefaultApi(config);

// Re-export types for convenience
export type { Creature } from './generated';
