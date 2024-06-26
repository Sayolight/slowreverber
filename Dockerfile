FROM node:lts-alpine

WORKDIR /app

COPY . /app/

ENV BOT_TOKEN=${BOT_TOKEN} \
    log=${log} \
    DB_HOST=${DB_HOST} \
    DB_PORT=${DB_PORT} \
    DB_NAME=${DB_NAME} \
    DB_USERNAME=${DB_USERNAME} \
    DB_PASSWORD=${DB_PASSWORD} \
    REDIS_HOST=${REDIS_HOST} \
    REDIS_PORT=${REDIS_PORT} \
    REDIS_PASS=${REDIS_PASS} \
    ADVERTISEMENT_STATUS=${ADVERTISEMENT_STATUS} \
    ADMANAGER_URL=${ADMANAGER_URL}

RUN npm install
RUN apk update
RUN apk add ffmpeg sox

VOLUME app

CMD npm run bot