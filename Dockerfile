# ==========================================
# STAGE 1: Build the React + Vite application
# ==========================================
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency definition files first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install clean dependencies according to lockfile
RUN npm ci

# Copy all source files and configuration
COPY . .

# Build argument for Vite environment variables (can be overridden during docker build)
ARG VITE_BASE_URL_API
ENV VITE_BASE_URL_API=${VITE_BASE_URL_API}

# Run TypeScript check and production build (outputs to /app/dist)
RUN npm run build

# ==========================================
# STAGE 2: Production Nginx Server
# ==========================================
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration for React SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
