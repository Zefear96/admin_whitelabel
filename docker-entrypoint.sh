#!/bin/sh
echo "Injecting runtime env variables..."

for var in VITE_APP_NAME VITE_KEYCLOAK_URL VITE_BASE_URL VITE_KEYCLOAK_REALM VITE_KEYCLOAK_CLIENT
do
  VAL=$(eval echo \$$var)
  if [ ! -z "$VAL" ]; then
    sed -i "s|__${var}__|$VAL|g" /usr/share/nginx/html/env-config.js
  fi
done

exec "$@"
