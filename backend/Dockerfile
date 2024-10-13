# Use a Node.js base image
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --no-frozen-lockfile; else echo "Lockfile not found." && exit 1; fi

COPY /certs/STAR_uap_edu_ar.crt /apps/certs/
COPY /certs/uap.edu.ar.key /apps/certs/
COPY /certs/CAbundle.crt /apps/certs/

EXPOSE 3001
CMD ["node", "server.js"]