import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/client/useAuth';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/dataDisplay/loader/Loader';



export default function LoginPage() {
  const { keycloak, initialized, authenticated } = useAuth();
  const navigate = useNavigate();
  const isRun = useRef(false);

  const [hasTriedLogin, setHasTriedLogin] = useState(false);

  useEffect(() => {
    if (!isRun.current) return;
    isRun.current = true;

    if (initialized) {
      if (authenticated) {
        // console.log('User already authenticated, redirecting to home...');
        navigate('/', { replace: true });
      } else if (!hasTriedLogin) {
        // console.log('User not authenticated, initiating login...');
        setHasTriedLogin(true);

        // Небольшая задержка чтобы избежать проблем с навигацией
        setTimeout(() => {
          const basePath = import.meta.env.BASE_URL || '/backoffice';
          keycloak.login({
            // Перенаправляем на главную страницу после логина, а не обратно на /login
            redirectUri: `${window.location.origin}${basePath}/`
          });
        }, 100);
      }
    }
  }, [initialized, authenticated, navigate, keycloak, hasTriedLogin]);

  // Показываем загрузку пока Keycloak инициализируется
  if (!initialized) {
    return (
      <Loader />
    );
  }

  // Показываем загрузку пока идет процесс логина
  if (!authenticated && hasTriedLogin) {
    return (
      <Loader />
    );
  }

  return (
    <Loader />
  )
}