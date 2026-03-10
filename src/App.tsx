import './App.css'
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from "./auth/AuthProvider";  // провайдер
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './theme/ThemeContext';
import { NotificationProvider } from "./components/dataDisplay/NotificationProvider";

// Базовый путь приложения (для работы в подпапке /backoffice)
// Vite автоматически устанавливает import.meta.env.BASE_URL из vite.config.ts
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');
// const BASE_PATH = import.meta.env.BASE_URL || '/';

function App() {
  return (
      <ThemeProvider>
          <AuthProvider>
            <BrowserRouter basename={BASE_PATH}>
              <NotificationProvider>
                <AppRoutes />
              </NotificationProvider>
            </BrowserRouter>
          </AuthProvider>
      </ThemeProvider>
  )
}

export default App
