ARG NODE_VERSION=${12.19.0}
FROM node:${NODE_VERSION} as build

WORKDIR /work

RUN yarn \
    yarn build

FROM node:${NODE_VERSION} as main

USER koleg:koleg

COPY --from=build --chown=koleg:koleg /work/dist /app

RUN chmod -R 440 /app

ENTRYPOINT ["node", "/app/main.js"]
