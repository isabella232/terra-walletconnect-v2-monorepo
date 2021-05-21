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

## End points

### WebSocket connect

WebSocket Provider URL:

> **ws://{Service url}**
> 
> response 101 If OK

### Health check

Relay Provider URL:

> **http://{Service url}/health**
> 
> response 200 If OK


### Metrics collect

Relay get metrics URL:

> **https://{Service url}/metrics**
> 
> response process, http, websocket.. metrics,  If Ok


Key indicators can be obtained from metrics.

| Name | Descriptions | Related metrics |
| --------------- | --------------------- | ---------------- |
| `Messages` | Amount of web socket messages per minute | websocket_messages_total | 
| `Active WS connections` | Amount of open web socket connections | process_open_fds, websocket_new_connections |
| `Node event loop Lag seconds` | Heatmap of Node Event Loop Lag Seconds | nodejs_eventloop_lag_seconds |
| `Connections` | Rate of New/Closed connections per minute | websocket_new_connections (custom),  websocket_closed_connections (custom) |
| `Ratio closed/new connections` | Division of websocket closed connections and New connections per 5 minutes | websocket_closed_connections (custom), websocket_new_connections (custom)  |
| `Event loop lag mean seconds` | Nodejs default prometheus eventloop lag mean seconds | nodejs_eventloop_lag_mean_seconds |
| `CPU seconds` | Rate of System/User CPU process seconds per minute | process_cpu_seconds_total, process_cpu_system_seconds_total, process_cpu_user_seconds_total |
