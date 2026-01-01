
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { cwd } from 'node:process';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, cwd(), '');
  
  // Get API key from environment variables (GitHub Actions secrets) or env files
  // process.env has priority during GitHub Actions build
  const apiKey = process.env.VITE_API_KEY || env.VITE_API_KEY || env.API_KEY || process.env.API_KEY;
  
  console.log('🔧 Vite Config - API Key Status:');
  console.log('  process.env.VITE_API_KEY:', process.env.VITE_API_KEY ? '✓ Set' : '✗ Not set');
  console.log('  env.VITE_API_KEY:', env.VITE_API_KEY ? '✓ Set' : '✗ Not set');
  console.log('  env.API_KEY:', env.API_KEY ? '✓ Set' : '✗ Not set');
  console.log('  Final API Key:', apiKey ? '✓ Ready' : '✗ Missing');
  
  return {
    // Set base to repository name for GitHub Pages compatibility
    base: '/Zomi-GPT/',
    plugins: [react()],
    define: {
      // Inject API_KEY from environment variables
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'lucide-react'],
            gemini: ['@google/genai']
          }
        }
      }
    }
  };
});
