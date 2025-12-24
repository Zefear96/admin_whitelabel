import Keycloak from 'keycloak-js';
import { ENV } from '../env';

// console.log("Keycloak ENV:", {
//   url: import.meta.env.VITE_KEYCLOAK_URL,
//   realm: import.meta.env.VITE_KEYCLOAK_REALM,
//   clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
// });

// const keycloakInstance = new Keycloak ({
//   url: import.meta.env.VITE_KEYCLOAK_URL!,
//   realm: import.meta.env.VITE_KEYCLOAK_REALM!,
//   clientId: import.meta.env.VITE_KEYCLOAK_CLIENT!,
// });



const keycloakInstance = new Keycloak({
  url: ENV.KEYCLOAK_URL,
  realm: ENV.KEYCLOAK_REALM,
  clientId: ENV.KEYCLOAK_CLIENT,
});

export default keycloakInstance;