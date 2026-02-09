import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: mode === 'production' ?env.VITE_GITHUB_PAGES_PATH : '/',
    plugins: [react()],
  }
})
