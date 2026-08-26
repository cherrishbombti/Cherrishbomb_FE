import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// 배포본은 Vercel rewrite(vercel.json)가 /api를 백엔드로 프록시하므로,
// 로컬 dev 서버도 같은 상대경로(/api)가 동작하도록 동일하게 프록시한다.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  };
});
