# Use the official lightweight Node.js 18 image.
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy the local code to the container image
COPY . /usr/src/app/

# Move into the frontend directory
WORKDIR /usr/src/app/frontend

# Install dependencies.
RUN pnpm install 

# Move into the lib directory
WORKDIR /usr/src/app/lib

# Install dependencies.
RUN pnpm install

# Move back into the frontend directory
WORKDIR /usr/src/app/frontend

# Install pnpm and a lightweight static server
RUN npm install -g pnpm serve

# Build the application.
RUN pnpm build

# Remove development dependencies.
RUN pnpm prune --prod

# Expose the desired port (e.g., 3000)
EXPOSE 3000

# Serve the built application with "serve" on port 3000.
CMD ["serve", "-s", "dist", "-l", "3000"]
