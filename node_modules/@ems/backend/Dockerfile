FROM node:18-alpine

WORKDIR /app

# Copy root package.json and lockfile
COPY package*.json ./

# Copy workspace packages
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY shared/package.json ./shared/

# Install dependencies
RUN npm install

# Copy source code
COPY backend ./backend
COPY shared ./shared

# Build shared
WORKDIR /app/shared
RUN npm run build

# Build backend
WORKDIR /app/backend
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
