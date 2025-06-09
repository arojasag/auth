FROM node:22-alpine

WORKDIR /app

# Copy package.json and package-lock.json files
COPY package.json .
COPY package-lock.json .

# Install all dependencies
RUN npm install

# Copy generated prisma files
COPY prisma ./prisma/

# Generate prisma client
RUN npx prisma generate

# Copy environment variables if they exist
COPY .env* .

# Copy tsconfig.json file
COPY tsconfig.json .

# Copy all other project files
COPY . .

# Build the microservice
RUN npm run build

EXPOSE ${mu_auth_ms_EXPOSED_PORT}

# Install bash
RUN apk add --no-cache bash

CMD ["npm", "start"]
