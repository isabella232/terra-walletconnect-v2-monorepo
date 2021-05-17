import { EventEmitter } from "events";
import { Logger } from "pino";
import { generateChildLogger } from "@pedrouid/pino-utils";
import { RelayJsonRpc, RELAY_JSONRPC } from "relay-provider";
import {
  IJsonRpcProvider,
  JsonRpcPayload,
  isJsonRpcRequest,
  JsonRpcRequest,
  formatJsonRpcResult,
  RequestArguments,
} from "@json-rpc-tools/utils";
import { JsonRpcProvider } from "@json-rpc-tools/provider";

import { HttpService } from "./http";
import { IRIDIUM_DEFAULT_PUBLISH_TTL, IRIDIUM_EVENTS } from "./constants/iridium";

export class IridiumService {
  public events = new EventEmitter();

  public provider: IJsonRpcProvider;

  public context = "iridium";

  constructor(public server: HttpService, public logger: Logger, iridiumUrl: string) {
    this.server = server;
    this.logger = generateChildLogger(logger, this.context);
    this.provider = new JsonRpcProvider(iridiumUrl);
    this.registerEventListeners();
  }

  get connected(): boolean {
    return this.provider.connection.connected;
  }

  public async init(): Promise<void> {
    this.logger.trace(`Initialized`);
    await this.provider.connect();
  }

  public async publish(topic: string, payload: JsonRpcPayload): Promise<void> {
    this.logger.debug(`Publishing Payload`);
    this.logger.trace({ type: "method", method: "publish", params: { topic, payload } });
    try {
      const request: RequestArguments<RelayJsonRpc.PublishParams> = {
        method: RELAY_JSONRPC.waku.publish,
        params: {
          topic,
          message: opts.message,
          ttl: IRIDIUM_DEFAULT_PUBLISH_TTL,
        },
      };
      this.logger.info(`Outgoing Relay Payload`);
      this.logger.debug({ type: "payload", direction: "outgoing", request });
      await this.provider.request(request);
      this.logger.debug(`Successfully Published Payload`);
      this.logger.trace({ type: "method", method: "publish", request });
    } catch (e) {
      this.logger.debug(`Failed to Publish Payload`);
      this.logger.error(e);
      throw e;
    }
  }

  public async subscribe(
    topic: string,
    listener: (payload: JsonRpcPayload) => void,
  ): Promise<string> {
    this.logger.debug(`Subscribing Topic`);
    this.logger.trace({ type: "method", method: "subscribe", params: { topic } });
    try {
      const request: RequestArguments<RelayJsonRpc.SubscribeParams> = {
        method: RELAY_JSONRPC.waku.subscribe,
        params: {
          topic,
        },
      };
      this.logger.info(`Outgoing Relay Payload`);
      this.logger.debug({ type: "payload", direction: "outgoing", request });
      const id = await this.provider.request(request);
      this.events.on(id, async ({ message }) => {
        listener(message);
      });
      this.logger.debug(`Successfully Subscribed Topic`);
      this.logger.trace({ type: "method", method: "subscribe", request });
      return id;
    } catch (e) {
      this.logger.debug(`Failed to Subscribe Topic`);
      this.logger.error(e);
      throw e;
    }
  }

  public async unsubscribe(id: string): Promise<void> {
    this.logger.debug(`Unsubscribing Topic`);
    this.logger.trace({ type: "method", method: "unsubscribe", params: { id } });
    try {
      const request: RequestArguments<RelayJsonRpc.UnsubscribeParams> = {
        method: RELAY_JSONRPC.waku.unsubscribe,
        params: {
          id,
        },
      };
      this.logger.info(`Outgoing Relay Payload`);
      this.logger.debug({ type: "payload", direction: "outgoing", request });

      await this.provider.request(request);
      this.events.removeAllListeners(id);
      this.logger.debug(`Successfully Unsubscribed Topic`);
      this.logger.trace({ type: "method", method: "unsubscribe", request });
    } catch (e) {
      this.logger.debug(`Failed to Unsubscribe Topic`);
      this.logger.error(e);
      throw e;
    }
  }

  public on(event: string, listener: any): void {
    this.events.on(event, listener);
  }

  public once(event: string, listener: any): void {
    this.events.once(event, listener);
  }

  public off(event: string, listener: any): void {
    this.events.off(event, listener);
  }

  public removeListener(event: string, listener: any): void {
    this.events.removeListener(event, listener);
  }

  // ---------- Private ----------------------------------------------- //

  private onPayload(payload: JsonRpcPayload) {
    this.logger.info(`Incoming Relay Payload`);
    this.logger.debug({ type: "payload", direction: "incoming", payload });
    if (isJsonRpcRequest(payload)) {
      if (payload.method.endsWith("_subscription")) {
        const event = (payload as JsonRpcRequest<RelayJsonRpc.SubscriptionParams>).params;
        this.events.emit(event.id, event.data);
        const response = formatJsonRpcResult(payload.id, true);
        this.provider.connection.send(response);
      }
    }
  }

  private registerEventListeners(): void {
    this.provider.on("payload", (payload: JsonRpcPayload) => this.onPayload(payload));
    this.provider.on("connect", () => this.events.emit(IRIDIUM_EVENTS.connect));
    this.provider.on("disconnect", () => {
      this.events.emit(IRIDIUM_EVENTS.disconnect);
      this.provider.connect();
    });
    this.provider.on("error", e => this.events.emit(IRIDIUM_EVENTS.error, e));
  }
}
