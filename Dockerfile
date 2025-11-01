# Use official Bun image
FROM oven/bun:1.1.38-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose port (Railway will override with PORT env variable)
EXPOSE 3000

# Start the application
CMD ["bun", "run", "src/index.ts"]
