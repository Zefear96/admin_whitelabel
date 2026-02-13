FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist

# Создаем скрипт для подстановки переменных ПРИ СТАРТЕ
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'sed -i "s|__VITE_APP_NAME__|${VITE_APP_NAME}|g" /app/dist/env-config.js' >> /app/entrypoint.sh && \
    echo 'sed -i "s|__VITE_KEYCLOAK_URL__|${VITE_KEYCLOAK_URL}|g" /app/dist/env-config.js' >> /app/entrypoint.sh && \
    echo 'sed -i "s|__VITE_BASE_URL__|${VITE_BASE_URL}|g" /app/dist/env-config.js' >> /app/entrypoint.sh && \
    echo 'sed -i "s|__VITE_KEYCLOAK_REALM__|${VITE_KEYCLOAK_REALM}|g" /app/dist/env-config.js' >> /app/entrypoint.sh && \
    echo 'sed -i "s|__VITE_KEYCLOAK_CLIENT__|${VITE_KEYCLOAK_CLIENT}|g" /app/dist/env-config.js' >> /app/entrypoint.sh && \
    echo 'exec serve -s dist -l 3000' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

EXPOSE 3000

# Запускаем через скрипт
ENTRYPOINT ["/app/entrypoint.sh"]