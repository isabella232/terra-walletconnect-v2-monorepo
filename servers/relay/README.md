# Terra WallterConnect Relay Server


Open relay server for connecting Terra mobile station to Dapps 

Android Mobile Station - https://play.google.com/store/apps/details?id=money.terra.station&hl=ko&gl=US


## Prerequisits

- Node >= v10.24
- NPM


## Configuration

### Variables

The configuration is provided through the following environment variables at runtime:

| Name | Required | Default | Description |
| ---- | -------- | ------- | ----------- |
| `HOST` | yes | `0.0.0.0` | Service domain | 
| `PORT` | yes | `6379` | Service port |
| `NODE_ENV` | yes  | `development` | Node environment(development/production) |
| `REDIS_URL` | yes  | `redis://localhost:6379/0` | Redis URL (redis://host[:port]][/db]) |
| `REDIS_PREFIX` | no  | `terra-wc-relay` | Redis key prefix  |
| `REDIS_MAX_TTL` | no  | `604800` | Redis record expire second (default 7 days) |


### Environment file

You can set default values for any environment variables referenced in the Docker-compose, in an environment file named .env

```
HOST=0.0.0.0 #0.0.0.0 instead of 127.0.0.1, localhost
PORT=8080
NODE_ENV=production

REDIS_URL=redis://redis:6379
REDIS_PREFIX=terra-wc-relay
REDIS_MAX_TTL=604800 #default 7 days

GITHASH=00001
```

## Scripts

### Build

Install dependencies:

```
npm install
```

Builds the relay system local npm:

```
npm run build
```

### Run

Run relay on watch mode and shows logs:

```
npm run start
```

## Dockerization

Deploy production with Docker-compose:

```
docker-comopose up
```
