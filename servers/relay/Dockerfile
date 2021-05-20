FROM node:lts-alpine
COPY ./package.json /tmp
COPY ./package-lock.json /tmp
RUN npm ci --prefix /tmp

WORKDIR /relay

RUN cp -a /tmp/node_modules ./node_modules
COPY . .
RUN npm run build

USER node
#CMD lerna /relay/dist
ENTRYPOINT ["npm", "run"]
CMD ["start"]