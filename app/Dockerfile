# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./package.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Command to run your Node.js application
CMD ["npm", "run", "dev"]
