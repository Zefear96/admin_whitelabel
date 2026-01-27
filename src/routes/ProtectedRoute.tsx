import { useEffect, useRef } from "react";
import { useAuth } from "../hooks/client/useAuth";
import Loader from "../components/dataDisplay/loader/Loader";
import type { Props } from "../types/propsType";

export default function ProtectedRoute({ children }: Props) {
  const { keycloak, initialized, authenticated, isLoading, login } = useAuth();
  const loginAttempted = useRef(false);

  console.log("🛡️ [ProtectedRoute] Render:", {
    initialized,
    authenticated,
    isLoading,
    loginAttempted: loginAttempted.current,
    hasKeycloak: !!keycloak,
  });

  // Если пользователь не аутентифицирован, редиректим на логин
  // Используем useRef, чтобы избежать множественных редиректов
  useEffect(() => {
    console.log("🛡️ [ProtectedRoute] useEffect triggered:", {
      authenticated,
      initialized,
      isLoading,
      loginAttempted: loginAttempted.current,
    });

    if (!authenticated && initialized && !isLoading && !loginAttempted.current) {
      console.log("🔴 [ProtectedRoute] User not authenticated, redirecting to login");
      loginAttempted.current = true;
      // Используем метод login из контекста, который настроен с правильным redirectUri
      login();
    }
  }, [authenticated, initialized, isLoading, login]);

  // Ждём инициализацию Keycloak
  if (!initialized || isLoading) {
    console.log("🛡️ [ProtectedRoute] Showing loader - waiting for initialization");
    return <Loader />;
  }

  if (!authenticated) {
    console.log("🛡️ [ProtectedRoute] Showing loader - user not authenticated");
    return <Loader />;
  }

  console.log("🛡️ [ProtectedRoute] Rendering children - user is authenticated");
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