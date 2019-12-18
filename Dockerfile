FROM node:10-slim

WORKDIR /chatroom-server

COPY package.json ./

RUN yarn --production --registry=https://registry.npm.taobao.org

COPY . .

COPY wait-for-it.sh /
RUN chmod +x /wait-for-it.sh

CMD /wait-for-it.sh db:3306 -- npm run docker