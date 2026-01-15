import './App.css'
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from "./auth/AuthProvider";  // провайдер
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './theme/ThemeContext';

// Базовый путь приложения (для работы в подпапке /backoffice)
const BASE_PATH = import.meta.env.BASE_URL || '/backoffice/';

function App() {
  return (
      <ThemeProvider>
          <AuthProvider>
            <BrowserRouter basename={BASE_PATH}>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
      </ThemeProvider>
  )
}

export default App
