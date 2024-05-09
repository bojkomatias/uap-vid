# Install dependencies only when needed
FROM mitchpash/pnpm AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY pnpm-lock.yaml .npmrc ./

RUN pnpm fetch
COPY . .

# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm install
RUN pnpm build

# Production image, copy all the files and run next
FROM mitchpash/pnpm AS runner
WORKDIR /app

ENV TZ="America/Argentina/Buenos_Aires"
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV HOSTNAME 0.0.0.0
ENV PORT 3000

CMD ["pnpm", "start"]