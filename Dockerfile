# ---------- STAGE 1: build ----------
    FROM node:18 AS build

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    RUN npm run build
    
    
    # ---------- STAGE 2: nginx ----------
    FROM nginx:alpine
    
    RUN rm /etc/nginx/conf.d/default.conf
    
    COPY nginx.conf /etc/nginx/conf.d
    COPY --from=build /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    