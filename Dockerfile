# ========================================
# HARDENED DOCKERFILE - POST-BREACH SECURITY
# Zero Trust Architecture Implementation
# ========================================

# Multi-stage build for maximum security
FROM node:20.10.0-alpine AS base

# ========================================
# STAGE 1: Production Dependencies Only
# ========================================
FROM base AS deps
WORKDIR /app

# Security: Install only production dependencies with no scripts
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# ========================================
# STAGE 2: Build Stage
# ========================================
FROM base AS builder
WORKDIR /app

# Build-time arguments for Next.js
ARG NEXT_PUBLIC_N8N_WEBHOOK_URL
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_BOT_SCRIPT_URL

ENV NEXT_PUBLIC_N8N_WEBHOOK_URL=${NEXT_PUBLIC_N8N_WEBHOOK_URL}
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
ENV NEXT_PUBLIC_BOT_SCRIPT_URL=${NEXT_PUBLIC_BOT_SCRIPT_URL}

# Install all dependencies for build
COPY package*.json ./
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Copy source and build
COPY . .
RUN npm run build

# ========================================
# STAGE 3: Hardened Production Runtime
# ========================================
FROM base AS runner
WORKDIR /app

# Security: Set production environment
ENV NODE_ENV=production
ENV PORT=6118
ENV HOSTNAME="0.0.0.0"

# Security: Create non-root user with minimal privileges
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    # Remove package managers and shells to prevent post-compromise activity
    rm -rf /usr/bin/npm /usr/bin/npx /usr/local/bin/npm /usr/local/bin/npx && \
    # Remove apk to prevent package installation
    rm -rf /sbin/apk /usr/sbin/apk /bin/apk && \
    # Make shell read-only (can't be removed due to Node.js dependencies)
    chmod 0555 /bin/sh /bin/ash 2>/dev/null || true

# Security: Copy files with strict ownership
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Security: Create necessary runtime directories with correct permissions
RUN mkdir -p /tmp && \
    chown nextjs:nodejs /tmp && \
    chmod 1777 /tmp

# Security: Switch to non-root user (CRITICAL)
USER nextjs

EXPOSE 6118

# Security: Use exec form to prevent shell injection
#HealthCheck disabled to reduce attack surface
CMD ["node", "server.js"]
