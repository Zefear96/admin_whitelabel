import Keycloak from 'keycloak-js';
import { ENV } from '../config/env';

const keycloakInstance = new Keycloak({
  url: ENV.KEYCLOAK_URL,
  realm: ENV.KEYCLOAK_REALM,
  clientId: ENV.KEYCLOAK_CLIENT,
});

export default keycloakInstance;