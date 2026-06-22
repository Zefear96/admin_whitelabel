import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path';
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json'


// https://vite.dev/config/
const keyPath = path.resolve(__dirname, 'certs/localhost-key.pem')
const certPath = path.resolve(__dirname, 'certs/localhost.pem')
const httpsConfig = fs.existsSync(keyPath) && fs.existsSync(certPath)
  ? { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }
  : undefined

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(),],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  server: {
    host: true,
    port: 3001, // любой свободный порт
    https: process.env.NODE_ENV === 'development' ? {
      key: fs.readFileSync('./certs/localhost-key.pem'),
      cert: fs.readFileSync('./certs/localhost.pem'),
    } : undefined,
  },
  // base path для работы приложения в подпапке /backoffice
  // В production используем /backoffice/, в dev можно использовать / для локальной разработки
  base: '/backoffice',
  assetsInclude: ['**/*.lottie'],
}))
