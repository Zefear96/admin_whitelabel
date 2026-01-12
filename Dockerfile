FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# Build arguments для переменных окружения
ARG VITE_APP_NAME
ARG VITE_KEYCLOAK_URL
ARG VITE_BASE_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT

# Заменяем плейсхолдеры в env-config.js на этапе сборки
RUN sed -i "s|__VITE_APP_NAME__|${VITE_APP_NAME}|g" public/env-config.js && \
    sed -i "s|__VITE_KEYCLOAK_URL__|${VITE_KEYCLOAK_URL}|g" public/env-config.js && \
    sed -i "s|__VITE_BASE_URL__|${VITE_BASE_URL}|g" public/env-config.js && \
    sed -i "s|__VITE_KEYCLOAK_REALM__|${VITE_KEYCLOAK_REALM}|g" public/env-config.js && \
    sed -i "s|__VITE_KEYCLOAK_CLIENT__|${VITE_KEYCLOAK_CLIENT}|g" public/env-config.js

RUN npm run build

FROM node:20-alpine
WORKDIR /app

# Устанавливаем serve глобально
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3000

# Запускаем serve с SPA режимом (все запросы перенаправляются на index.html)
CMD ["serve", "-s", "dist", "-l", "3000"]
