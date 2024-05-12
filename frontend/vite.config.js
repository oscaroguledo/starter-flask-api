import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// const localOrigin = "http://127.0.0.1:4173";
const productionOrigin = "http://0.0.0.0:4173";

const publicBasePath = '/dowellproctoring/';

// https://vitejs.dev/config/
export default defineConfig({
  base: publicBasePath,
  plugins: [react()],
  server: {
    port: 4173,
    strictPort: true,
    host: true,
    origin: productionOrigin,
  },
})
