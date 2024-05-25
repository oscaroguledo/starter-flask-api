# Using Node.js version 20 based on Alpine for a lightweight image
FROM node:20-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 9000

# Define environment variable
ENV PORT 9000

# Start the application
CMD ["node", "index.js"]
