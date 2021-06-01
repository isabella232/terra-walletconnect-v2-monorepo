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
| `LOG_LEVEL` | no  | `debug` | Console log level(trace/debug/info/warn/error) |
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
LOG_LEVEL=debug

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



## Monitoring
### Metrics

| Name | Descriptions | Remarks |
| -------- | --------------------- | --------- |
| `relay_process_cpu_user_seconds_total` | Total user CPU time spent in seconds | |
| `relay_process_cpu_system_seconds_total` | Total system CPU time spent in seconds | |
| `relay_process_cpu_seconds_total` | Total user and system CPU time spent in seconds | |
| `relay_process_start_time_seconds` | Start time of the process since unix epoch in seconds | |
| `relay_process_resident_memory_bytes` | Resident memory size in bytes | |
| `relay_nodejs_eventloop_lag_seconds` | Lag of event loop in seconds| |
| `relay_nodejs_eventloop_lag_min_seconds` | The minimum recorded event loop delay | |
| `relay_nodejs_eventloop_lag_max_seconds` | The maximum recorded event loop delay | |
| `relay_nodejs_eventloop_lag_mean_seconds` | The mean of the recorded event loop delays | |
| `relay_nodejs_eventloop_lag_stddev_seconds` | The standard deviation of the recorded event loop delays | |
| `relay_nodejs_eventloop_lag_p50_seconds` | The 50th percentile of the recorded event loop delays | |
| `relay_nodejs_eventloop_lag_p90_seconds` | The 90th percentile of the recorded event loop delays | |
| `relay_nodejs_eventloop_lag_p99_seconds` | The 99th percentile of the recorded event loop delays | |
| `relay_nodejs_active_handles{type="WriteStream"}` | Number of active libuv handles grouped by handle type. Every handle type is C++ class name | type: WriteStream, Socket, Timer, Server |
| `relay_nodejs_active_handles_total` | Total number of active handles | |
| `relay_nodejs_active_requests` | Number of active libuv requests grouped by request type. Every request type is C++ class name | |
| `relay_nodejs_active_requests_total` | Total number of active requests | |
| `relay_nodejs_heap_size_total_bytes` | Process heap size from Node.js in bytes | |
| `relay_nodejs_heap_size_used_bytes` | Process heap size used from Node.js in bytes | |
| `relay_nodejs_external_memory_bytes` | Node.js external memory size in bytes | |
| `relay_nodejs_heap_space_size_total_bytes{space="read_only"}` | Process heap space size total from Node.js in bytes | space: read_only, new, old, code, map, large_object |
| `relay_nodejs_heap_space_size_used_bytes{space="read_only"}` | Process heap space size used from Node.js in bytes | space: read_only, new, old, code, map, large_object |
| `relay_nodejs_heap_space_size_available_bytes{space="read_only"}` | Process heap space size available from Node.js in bytes | space: read_only, new, old, code, map, large_object |
| `relay_nodejs_version_info` | Node.js version info | | 
| `relay_nodejs_gc_duration_seconds_bucket` | Garbage collection duration by kind, one of major, minor, incremental or weakcb | |
| `relay_websocket_new_connections` | Sum of opened ws connections | custom metric |
| `relay_websocket_closed_connections` | Sum of closed ws connections | custom metric |
| `relay_websocket_messages_total` | Total amount of messages | custom metric |
| `relay_hello_counter` | How much the /hello has been called | custom metric |


### Indicators
Indicators can be obtained through a combination of metrics.

| Name | Descriptions | Related metrics |
| --------------- | --------------------- | ---------------- |
| `Messages` | Amount of web socket messages per minute | relay_websocket_messages_total | 
| `Active WS connections` | Amount of open web socket connections | relay_process_open_fds, relay_websocket_new_connections |
| `Node event loop Lag seconds` | Heatmap of Node Event Loop Lag Seconds | relay_nodejs_eventloop_lag_seconds |
| `Connections` | Rate of New/Closed connections per minute | websocket_new_connections,  relay_websocket_closed_connections |
| `Ratio closed/new connections` | Division of websocket closed connections and New connections per 5 minutes | relay_websocket_closed_connections, relay_websocket_new_connections |
| `Event loop lag mean seconds` | Nodejs default prometheus eventloop lag mean seconds | relay_nodejs_eventloop_lag_mean_seconds |
| `CPU seconds` | Rate of System/User CPU process seconds per minute | relay_process_cpu_seconds_total, relay_process_cpu_system_seconds_total, relay_process_cpu_user_seconds_total |
