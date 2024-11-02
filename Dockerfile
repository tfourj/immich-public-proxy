FROM node:lts-slim

WORKDIR /app

COPY app/package.json ./

RUN npm install --omit=dev
RUN npm install pm2 -g

COPY app/ ./

ENV NODE_ENV=production

# Build without type checking, as we have removed the Typescript
# dev-dependencies above to save space in the final build
RUN npx tsc --noCheck

RUN chown -R node:node /app

USER node

HEALTHCHECK --interval=30s --start-period=10s --timeout=5s CMD node /app/healthcheck.js || exit 1

CMD ["pm2-runtime", "dist/index.js" ]
