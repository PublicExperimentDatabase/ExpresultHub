FROM alpine:latest AS base

ENV NODE_ENV=production APP_PATH=/app

WORKDIR $APP_PATH

# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk add --no-cache --update nodejs=18.16.1-r0 yarn=1.22.19-r0

FROM base AS install

COPY ./package.json ./yarn.lock ./

RUN yarn install

FROM base

COPY --from=install $APP_PATH/node_modules ./node_modules

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
