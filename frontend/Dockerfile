# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Build the Next.js app with standalone output
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Install build dependencies
RUN npm install

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create necessary directories
RUN mkdir -p .next/static

# Copy necessary files from builder with proper permissions
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/next-env.d.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure the server.js is executable
RUN chmod +x server.js

# Set proper permissions
RUN chown -R nextjs:nodejs /app

# Set the user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set the hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]