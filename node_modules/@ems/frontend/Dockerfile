FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/

RUN npm install

COPY frontend ./frontend
COPY shared ./shared

WORKDIR /app/shared
RUN npm run build

WORKDIR /app/frontend
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
