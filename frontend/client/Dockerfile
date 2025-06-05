# Stage 1: Build the Angular app
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy Angular build output
COPY --from=builder /app/dist/client/browser /usr/share/nginx/html

EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf

