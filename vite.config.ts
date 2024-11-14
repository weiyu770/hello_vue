import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// @ts-ignore
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8101',
        changeOrigin: true,
      }
    }
  }
});
