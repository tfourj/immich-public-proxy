FROM node:lts-slim

# Install wget for healthcheck
RUN apt-get update && \
    apt-get install -y wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY app/ ./

RUN chown -R node:node /app

USER node

RUN npm install --omit=dev

ARG PACKAGE_VERSION
ENV APP_VERSION=${PACKAGE_VERSION}
ENV NODE_ENV=production

# Build without type checking, as we have removed the Typescript
# dev-dependencies above to save space in the final build.
# Type checking is done in the repo before building the image.
RUN npx tsc --noCheck

HEALTHCHECK --interval=30s --start-period=10s --timeout=5s CMD wget -q --spider http://localhost:3000/share/healthcheck || exit 1

CMD ["node", "dist/index.js" ]
