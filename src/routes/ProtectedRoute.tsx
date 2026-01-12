import { useEffect } from "react";
import { useAuth } from "../hooks/client/useAuth";
import Loader from "../components/dataDisplay/loader/Loader";
import type { Props } from "../types/propsType";

export default function ProtectedRoute({ children }: Props) {
  const { keycloak, initialized, authenticated, isLoading } = useAuth();

  // Ждём инициализацию Keycloak
  if (!initialized || isLoading) {
    return <Loader />;
  }

  if (!authenticated) {
    keycloak.login(); // ← ТОЛЬКО здесь
    return <Loader />;
  }

  return children;
}


// Если сессии нет — редиректим в Keycloak
// if (!authenticated) {
//   keycloak.login({
//     redirectUri: window.location.href, // вернёт на ТЕКУЩУЮ страницу
//   });
//   return <Loader />;
// }

// Сессия есть — рендерим страницу