import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import { fileURLToPath } from 'url';

const configDirectory = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': path.resolve(configDirectory, './src/assets'),
      
    },
  },
});
