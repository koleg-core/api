ARG NODE_VERSION=12.19.0
FROM node:${NODE_VERSION} as build

ENV NODE_ENV=production \
    NODE_VERSION=${NODE_VERSION}

COPY . /work/

WORKDIR /work

RUN npm install --also=dev \
    && npm run build

FROM node:${NODE_VERSION} as main

USER koleg:koleg

COPY --from=build --chown=koleg:koleg /work/dist /app

RUN chmod -R 440 /app

ENTRYPOINT ["node", "/app/main.js"]
