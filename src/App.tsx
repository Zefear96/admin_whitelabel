import './App.css'
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from "./store/AuthProvider";  // провайдер
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './theme/ThemeContext';
import { KeycloakProvider } from './store/KeycloakProvider';

function App() {
  return (
      <ThemeProvider>
        {/* <KeycloakProvider> */}
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        {/* </KeycloakProvider> */}
      </ThemeProvider>
  )
}

export default App
