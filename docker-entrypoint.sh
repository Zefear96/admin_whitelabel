#!/bin/sh
echo "Injecting runtime env variables..."

ENV_FILE="/usr/share/nginx/html/env-config.js"

for var in \
  VITE_APP_NAME \
  VITE_KEYCLOAK_URL \
  VITE_BASE_URL \
  VITE_KEYCLOAK_REALM \
  VITE_KEYCLOAK_CLIENT
do
  VAL=$(eval echo \$$var)
  if [ -n "$VAL" ]; then
    sed -i "s|__${var}__|$VAL|g" "$ENV_FILE"
  fi
done

exec "$@"
