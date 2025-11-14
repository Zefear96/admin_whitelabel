// import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
// import type { KeycloakInstance } from 'keycloak-js';
// import keycloak from '../config/keycloak/keycloak';

// // Глобальная переменная для отслеживания инициализации
// // Удаляем глобальную переменную, так как она вызывает проблемы при горячей перезагрузке

// interface KeycloakContextType {
//   keycloak: KeycloakInstance;
//   initialized: boolean;
//   authenticated: boolean;
// }

// const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);

// interface KeycloakProviderProps {
//   children: ReactNode;
// }

// export function KeycloakProvider({ children }: KeycloakProviderProps) {
//   const [initialized, setInitialized] = useState(false);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     const initKeycloak = async () => {
//       console.log('Starting Keycloak initialization...');
//       console.log('Keycloak URL:', keycloak.authServerUrl || 'undefined');

//       try {
//         const auth = await keycloak.init({
//           onLoad: 'login-required',
//           silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
//           checkLoginIframe: false,
//           pkceMethod: 'S256',
//           // thirdPartyCookies: false,
//         });

//         console.log('Keycloak initialized successfully, authenticated:', auth);
//         setAuthenticated(auth);

//         if (auth) {
//           console.log("Token:", keycloak.token);
//           console.log("User Info:", keycloak.tokenParsed);
//         }
//       } catch (error) {
//         console.error('Keycloak initialization failed:', error);
//         setAuthenticated(false);
//       } finally {
//         setInitialized(true);
//       }
//     };

//     // Проверяем, не инициализирован ли уже Keycloak
//     if (!keycloak.authenticated && !initialized) {
//       initKeycloak();
//     } else if (keycloak.authenticated) {
//       setAuthenticated(true);
//       setInitialized(true);
//     }
//   }, []);

//   const value: KeycloakContextType = {
//     keycloak,
//     initialized,
//     authenticated,
//   };

//   return (
//     <KeycloakContext.Provider value={value}>
//       {children}
//     </KeycloakContext.Provider>
//   );
// }

// export function useKeycloak(): KeycloakContextType {
//   const context = useContext(KeycloakContext);
//   if (!context) {
//     throw new Error('useKeycloak must be used within a KeycloakProvider');
//   }
//   return context;
// }
