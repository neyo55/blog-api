# Use official Node.js 18 image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Accept build-time env var
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install && ls -la node_modules/react-scripts

# Install serve globally
RUN npm install -g serve

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Start the app
CMD ["npx", "serve", "-s", "build", "-l", "3001"]









# # Use official Node.js 18 image
# FROM node:18-alpine

# # Set working directory
# WORKDIR /app

# # Copy env file into image (ensure this is BEFORE build)
# COPY .env .env

# # Install curl for health checks
# RUN apk add --no-cache curl

# # Copy package.json and install dependencies
# COPY package*.json ./
# RUN npm install && ls -la node_modules/react-scripts

# # Install serve globally
# RUN npm install -g serve

# # Copy application code
# COPY . .

# # Build the application
# RUN npm run build

# # Expose port
# EXPOSE 3001

# # Start the app
# CMD ["npx", "serve", "-s", "build", "-l", "3001"]



