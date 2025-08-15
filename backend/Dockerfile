# Use a Node.js base image
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --no-frozen-lockfile; else echo "Lockfile not found." && exit 1; fi

RUN mkdir -p /app/certs

EXPOSE 3001
CMD ["node", "server.js"]