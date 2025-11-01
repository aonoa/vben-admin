import { defineConfig } from '@vben/vite-config';
import react from '@vitejs/plugin-react';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [react()],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            // target: 'http://localhost:5320/api',
            target: 'http://localhost:8000/basic-api',
            ws: true,
          },
        },
      },
    },
  };
});
