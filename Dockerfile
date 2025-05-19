FROM node:22-alpine

WORKDIR /app

ENV PORT=5000

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

# Check for existence of required environment variables
COPY check_required_envs.sh .
RUN chmod +x check_required_envs.sh
RUN ./check_required_envs.sh

# Copy tsconfig.json file
COPY tsconfig.json .

# Copy all other project files
COPY . .

# Build API
RUN npm run build

# Run and expose the server
EXPOSE ${PORT}

CMD ["npm", "start"]