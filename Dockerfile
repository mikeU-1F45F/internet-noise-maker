FROM node:11.12-alpine

ENV SRC_ROOT /app

RUN mkdir -p ${SRC_ROOT}
WORKDIR ${SRC_ROOT}
COPY . ${SRC_ROOT}

ENV NODE_ENV=production

# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-on-alpine
RUN apk update && apk upgrade && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk add --no-cache \
  chromium@edge \
  nss@edge \
  freetype@edge \
  harfbuzz@edge

RUN npm install

CMD npm start

# docker build --rm=true -t itsmikechu/internet-noise-maker:1.1.4 .
# docker push itsmikechu/internet-noise-maker:1.1.4
