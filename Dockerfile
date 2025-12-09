# Multi-stage build for production security
FROM node:20.10.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Build stage
FROM base AS builder
WORKDIR /app

# Declarar ARGs para build time
ARG NEXT_PUBLIC_N8N_WEBHOOK_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_RECAPTCHA_SECRET_KEY
ARG NEXT_PUBLIC_BOT_SCRIPT_URL

ENV NEXT_PUBLIC_N8N_WEBHOOK_URL=${NEXT_PUBLIC_N8N_WEBHOOK_URL}
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
ENV NEXT_PUBLIC_RECAPTCHA_SECRET_KEY=${NEXT_PUBLIC_RECAPTCHA_SECRET_KEY}
ENV NEXT_PUBLIC_BOT_SCRIPT_URL=${NEXT_PUBLIC_BOT_SCRIPT_URL}

# Install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production image - minimal and secure
FROM base AS runner
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Set the port Next.js will listen on
ENV PORT=6118
ENV HOSTNAME="0.0.0.0"

EXPOSE 6118

# Use exec form for CMD to properly handle signals
CMD ["node", "server.js"]
