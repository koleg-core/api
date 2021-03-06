ARG NODE_VERSION=14.2.0
FROM node:${NODE_VERSION} as build

# TODO: fix warning to allow production run
# ENV NODE_ENV=production \
#     NODE_VERSION=${NODE_VERSION}

ENV NODE_VERSION=${NODE_VERSION}

COPY . /work/

WORKDIR /work

RUN npm install \
    && npm run build

FROM node:${NODE_VERSION} as main

WORKDIR /app

COPY --from=build \
    /work/package.json /work/package-lock.json \
    /app/

COPY --from=build /work/dist /app/dist/

RUN groupadd -r koleg \
    && useradd --no-log-init -r -g koleg koleg \
    && chown -R koleg:koleg /app \
    && npm i --prod

USER koleg:koleg

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start:prod"]
