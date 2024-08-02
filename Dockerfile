# Use an official Node.js runtime as a parent image
FROM node:18

# Set working directory in the container to /app
WORKDIR /app

# Install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Make port 3000 available outside this container
EXPOSE 3000

# Command to run the app
CMD [ "npm", "start" ]
