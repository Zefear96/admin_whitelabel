import { useEffect, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/client/useAuth";
import Loader from "../components/dataDisplay/loader/Loader";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const { keycloak, initialized, authenticated, isLoading } = useAuth();

  console.log(`ProtectedRoute - initialized: '${initialized}, 'authenticated: ' ${authenticated}`);

  // 1. Ждём завершения init + check-sso
  if (!initialized || isLoading) {
    return <Loader />;
  }

  // 2. SSO проверен, сессии НЕТ → логинимся
  if (!authenticated) {
    keycloak.login({
      redirectUri: window.location.origin + window.location.pathname,
    });

    return <Loader />;
  }

  // 3. Пользователь аутентифицирован
  console.log('User authenticated, rendering protected content');
  return children;
}


  // useEffect(() => {
  //   // Ждём инициализации и окончания проверки SSO
  //   if (!initialized) return;

  //   if (!authenticated) {
  //     console.log('User not authenticated, triggering Keycloak login...');
  //     keycloak?.login({
  //       redirectUri: window.location.origin + window.location.pathname
  //     });
  //   }
  // }, [initialized, authenticated, keycloak]);

  // // Пока Keycloak не инициализировался — просто ждём
  // if (!initialized || isLoading) {
  //   console.log('Keycloak not initialized, showing loading...');
  //   return <Loader />;
  // }

  // console.log('User authenticated, rendering protected content');
  // return children;