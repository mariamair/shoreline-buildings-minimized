# Stage 1: Install dependencies
FROM node:24-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev

# Stage 2: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production runner
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a log directory
RUN true \
  && mkdir -p /app/logs \
  && chown -R node:node /app/logs

# Copy only what is needed to run the app: standalone build, static files and public folder
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
 
# Use a non-root user for security reasons
USER node

EXPOSE 3000
ENV HOSTNAME=0.0.0.0
 
# Start the application
CMD ["node", "server.js"]