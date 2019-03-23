FROM node:11.12-alpine

ENV SRC_ROOT /src

RUN mkdir -p ${SRC_ROOT}
WORKDIR ${SRC_ROOT}
COPY . ${SRC_ROOT}

RUN apk update

RUN npm install

CMD npm start

# docker build --rm=true -t itsmikechu/internet-noise-maker:1.0.0 .
# docker push itsmikechu/internet-noise-maker:1.0.0