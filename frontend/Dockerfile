FROM node:18-slim as build
WORKDIR /app

ENV ESBUILD_BINARY_PATH=/usr/local/bin/esbuild

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build


FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
