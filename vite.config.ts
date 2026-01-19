
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Explicitly define env vars to ensure they get replaced by the string value at build time
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.VAPID_KEY': JSON.stringify(env.VAPID_KEY),
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    server: {
      host: true
    }
  };
});
