## Development stage
# Use an official Node.js runtime as the base image
FROM node:18-alpine as development

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./package.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the port defined in the environment variable
ENV PORT $PORT

# Command to run your Node.js application
CMD ["npm", "run", "start"]

## Build stage
# Use an official Node.js runtime as the base image
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./package.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build backend app
RUN npm run build

