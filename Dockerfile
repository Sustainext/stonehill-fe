#---------------- STAGE 1: The Builder ----------------
# Use the full Node.js image to build the app
FROM stonehillreg.azurecr.io/node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and lock files
COPY package*.json ./

# Install ALL dependencies, including devDependencies needed for the build
RUN npm install

# Copy the rest of the source code (respects .dockerignore)
COPY . .

# Increase memory for the build process
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the production-ready application.
# This will now create the .next/standalone and .next/static folders
RUN npm run build

#---------------- STAGE 2: The Production Runner ----------------
# Use a much smaller and more secure "alpine" image for the final stage
FROM stonehillreg.azurecr.io/node:18-alpine

# Set the working directory
WORKDIR /app

# Set the hostname required by Next.js running in a container
ENV HOSTNAME=0.0.0.0

# Copy the self-contained 'standalone' server from the builder stage
COPY --from=builder /app/.next/standalone ./

# Copy the 'public' folder (for images, fonts, etc.)
COPY --from=builder /app/public ./public

# Copy the '.next/static' folder which contains the JS/CSS for the client browser
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app will run on
EXPOSE 3000

# The command to run the optimized standalone server
CMD ["node", "server.js"]