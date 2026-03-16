# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app

# Enable corepack for modern package managers if needed, 
# but we'll stick to npm as package-lock.json is present.
COPY package.json package-lock.json ./
RUN npm ci

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY . .
RUN npx prisma@6 generate
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Automatically leverage standalone output trace
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "server.js"]
