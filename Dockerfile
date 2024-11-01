FROM node:lts-slim

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev

COPY . .

# Build without type checking, as we have removed the Typescript
# dev-dependencies above to save space in the final build
RUN npx tsc --noCheck

CMD [ "node", "dist/index.js" ]
