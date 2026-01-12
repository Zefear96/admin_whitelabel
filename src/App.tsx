import './App.css'
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from "./auth/AuthProvider";  // провайдер
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './theme/ThemeContext';

function App() {
  return (
      <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
      </ThemeProvider>
  )
}

export default App
