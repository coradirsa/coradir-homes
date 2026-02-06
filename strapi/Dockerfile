# ========================================
# STRAPI CMS DOCKERFILE
# Development/Production build
# ========================================

FROM node:20-alpine
WORKDIR /opt/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p /opt/app/public/uploads

EXPOSE 1337

ENV NODE_ENV=development

CMD ["npm", "run", "develop"]
