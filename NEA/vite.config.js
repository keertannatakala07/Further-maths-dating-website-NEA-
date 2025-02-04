import { defineConfig } from 'vite';

export default defineConfig({
  root: './src', 
  build: {
    outDir: '../dist', 
    rollupOptions: {
      input: {
        main: './src/index.html', 
        signup: './src/signUp.html', 
      },
    },
  },
  server: {
    fs: {
      allow: ['..'], 
    },
  },
});
