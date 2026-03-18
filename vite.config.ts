import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path';
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json'


// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(),],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  server: {
    host: true,
    port: 3001, // любой свободный порт
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.pem')),
    },
  },
  // base path для работы приложения в подпапке /backoffice
  // В production используем /backoffice/, в dev можно использовать / для локальной разработки
  base: '/backoffice',
  assetsInclude: ['**/*.lottie'],
}))
