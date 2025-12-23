import { useEffect, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/client/useAuth";
import Loader from "../components/dataDisplay/loader/Loader";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const { keycloak, initialized, authenticated, isLoading } = useAuth();

  console.log('ProtectedRoute - initialized:', initialized, 'authenticated:', authenticated);

  useEffect(() => {
    if (initialized && !authenticated) {
      console.log('User not authenticated, triggering Keycloak login...');
      keycloak?.login({
        redirectUri: window.location.origin + window.location.pathname
      });
    }
  }, [initialized, authenticated, keycloak]);

  // Пока Keycloak не инициализировался — просто ждём
  if (!initialized || isLoading) {
    console.log('Keycloak not initialized, showing loading...');
    return <Loader/>;
  }
  
  // Если уже инициализирован, но не авторизован — редиректим
  // if (!authenticated) {
  //   console.log('User not authenticated, redirecting to Keycloak login...');
  //   return <Navigate to="/login" replace />;
  // }

  console.log('User authenticated, rendering protected content');
  return children;
}
