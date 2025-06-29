import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Uncomment the lines below to enable HTTPS
    // https: {
    //   key: fs.readFileSync(path.join(process.cwd(), 'ssl/private-key.pem')),
    //   cert: fs.readFileSync(path.join(process.cwd(), 'ssl/certificate.pem')),
    // },
    port: 5173,
  },
});
