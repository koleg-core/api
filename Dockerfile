ARG NODE_VERSION=12.19.0
FROM node:${NODE_VERSION} as build

ENV NODE_ENV=production \
    NODE_VERSION=${NODE_VERSION}

COPY . /work/

WORKDIR /work

RUN npm install --also=dev \
    && npm run build

FROM node:${NODE_VERSION} as main

RUN groupadd -r koleg \
    && useradd --no-log-init -r -g koleg koleg

COPY --from=build --chown=koleg:koleg /work/dist /app

USER koleg:koleg

ENTRYPOINT ["node", "/app/main.js"]
