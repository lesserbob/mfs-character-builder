export const config = {
  jwtSecret:
    process.env.JWT_SECRET ||
    'your-super-secret-jwt-key-change-this-in-production',
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  httpsPort: process.env.HTTPS_PORT || 3443,
  corsOrigins: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://localhost:5173',
    'https://localhost:3000',
  ],
};
