FROM node:alpine3.14 AS build

WORKDIR /build

COPY [ "package.json", "package-lock.json", "./" ]

RUN npm ci

COPY . .

RUN npm run build

FROM node:alpine3.14 AS runtime

USER node

WORKDIR /usr/src/app

COPY --from=build /build/ ./

ENV NODE_PORT=3000
EXPOSE ${NODE_PORT}

CMD [ "npm", "run", "start:prod" ]