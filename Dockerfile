# Stage 1: Build stage
FROM node:22.12-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build && \
    rm -rf src

# Obfuscate the dist folder
RUN npm run obfuscate

# Stage 2: Final stage
FROM alpine:latest

# Create and change to the app directory
WORKDIR /usr/src/app

# Install only necessary runtime dependencies
RUN apk add --no-cache nodejs npm

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/.env ./.env
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3651

# Start the Next.js application
CMD ["npm", "start"]