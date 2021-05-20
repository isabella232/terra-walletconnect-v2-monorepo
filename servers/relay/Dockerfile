FROM node:14-slim
COPY ./package.json /tmp
COPY ./package-lock.json /tmp
RUN npm ci --prefix /tmp

WORKDIR /relay

RUN cp -a /tmp/node_modules ./node_modules
COPY . .
RUN npm run build

USER node
CMD node /relay/dist