FROM node:alpine

WORKDIR /usr/src/app

RUN apk add yarn

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./ ./

EXPOSE 8000

CMD ["yarn", "start"]
