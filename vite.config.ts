import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for the Gemini SDK
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Prevent crash if accessing other process.env props
      'process.env': {} 
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