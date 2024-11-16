import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// @ts-ignore
import path from 'path';


export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8101', // 后端服务器地址
        changeOrigin: true,              // 支持跨域
        //rewrite: (path) => path.replace(/^\/api/, '') // 去除前缀，匹配后端的 `/api`   rewrite: (path) => path.replace(/^\/api/, '') // 只去掉一次 `/api`
      }
    },
  },
});