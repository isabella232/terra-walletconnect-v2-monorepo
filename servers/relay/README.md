# Terra WallterConnect Relay Server


Relay server for connecting Terra mobile station to Dapps 

- Android Mobile Station - https://play.google.com/store/apps/details?id=money.terra.station&hl=ko&gl=US
- iOs Mobile Station - https://apps.apple.com/app/id1548434735
- Terra Bridge - https://bridge.terra.money/
- Mirror - https://terra.mirror.finance/
- Anchor - https://app.anchorprotocol.com/earn


## Prerequisits

- Node LTS
- NPM LTS


## Configuration

### Variables

The configuration is provided through the following environment variables at runtime

| Name | Required | Default | Description |
| ---- | -------- | ------- | ----------- |
| `HOST` | no | `0.0.0.0` | Service domain | 
| `PORT` | no | `5555` | Service port |
| `NODE_ENV` | no  | `development` | Node environment(development/production) |
| `REDIS_URL` | no  | `redis://localhost:6379/0` | Redis URL (redis://host[:port]][/db]) |
| `REDIS_PREFIX` | no  | `terra-wc-relay` | Redis key prefix  |
| `REDIS_MAX_TTL` | no  | `604800` | Redis record expire second (default 7 days) |
| `GITHASH` | no  | `0000000` | Service sub-identifier |


### Environment file

In an environment file named `.env`, It is easy to set default values for environment variables with Docker-compose
```
HOST=0.0.0.0 #0.0.0.0 instead of 127.0.0.1, localhost
PORT=5555
NODE_ENV=development

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
