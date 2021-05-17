import redis from "redis";
import { RelayJsonRpc } from "relay-provider";
import { Logger } from "pino";
import { generateChildLogger } from "@pedrouid/pino-utils";
import { safeJsonParse, safeJsonStringify } from "safe-json-utils";

import config from "./config";
import { sha256 } from "./utils";
import { SIX_HOURS } from "./constants";
import { Notification, LegacySocketMessage } from "./types";

export class RedisService {
  public client: any = redis.createClient(config.redis);
  public context = "redis";

  constructor(public logger: Logger) {
    this.logger = generateChildLogger(logger, this.context);
    this.initialize();
  }

  public setLegacyCached(message: LegacySocketMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.debug(`Setting Legacy Cached`);
      this.logger.trace({ type: "method", method: "setLegacyCached", message });
      this.client.lpush(
        [`legacy:${message.topic}`, safeJsonStringify(message)],
        (err: Error, res) => {
          if (err) reject(err);
          this.client.expire([`legacy:${message.topic}`, SIX_HOURS], (err: Error, res) => {
            if (err) reject(err);
            resolve();
          });
        },
      );
    });
  }

  public getLegacyCached(topic: string): Promise<LegacySocketMessage[]> {
    return new Promise((resolve, reject) => {
      this.client.lrange(`legacy:${topic}`, 0, -1, (err: Error, raw: any) => {
        if (err) reject(err);
        const messages: LegacySocketMessage[] = [];
        raw.forEach((data: string) => {
          const message = safeJsonParse(data);
          messages.push(message);
        });
        this.client.del(`legacy:${topic}`);
        this.logger.debug(`Getting Legacy Published`);
        this.logger.trace({ type: "method", method: "getLegacyCached", topic, messages });
        resolve(messages);
      });
    });
  }

  public setNotification(notification: Notification): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.debug(`Setting Notification`);
      this.logger.trace({ type: "method", method: "setNotification", notification });
      this.client.lpush(
        [`notification:${notification.topic}`, safeJsonStringify(notification)],
        (err: Error) => {
          if (err) reject(err);
          resolve();
        },
      );
    });
  }

  public getNotification(topic: string): Promise<Notification[]> {
    return new Promise((resolve, reject) => {
      this.client.lrange([`notification:${topic}`, 0, -1], (err: Error, raw: any) => {
        if (err) reject(err);
        const data = raw.map((item: string) => safeJsonParse(item));
        this.logger.debug(`Getting Notification`);
        this.logger.trace({ type: "method", method: "getNotification", topic, data });
        resolve(data);
      });
    });
  }

  public setPendingRequest(topic: string, id: number, message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const key = `pending:${id}`;
      const hash = sha256(message);
      const val = `${topic}:${hash}`;
      this.logger.debug(`Setting Pending Request`);
      this.logger.trace({ type: "method", method: "setPendingRequest", topic, id, message });
      this.client.set(key, val, (err: Error) => {
        if (err) reject(err);
        this.client.expire(key, config.REDIS_MAX_TTL, (err: Error) => {
          if (err) reject(err);
          resolve();
        });
      });
    });
  }

  public getPendingRequest(id: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.client.get(`pending:${id}`, (err: Error, data: string) => {
        if (err) reject(err);
        this.logger.debug(`Getting Pending Request`);
        this.logger.trace({ type: "method", method: "getPendingRequest", id, data });
        resolve(data);
      });
    });
  }

  public deletePendingRequest(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.debug(`Deleting Pending Request`);
      this.logger.trace({ type: "method", method: "deletePendingRequest", id });
      this.client.del(`pending:${id}`, (err: Error) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  // ---------- Private ----------------------------------------------- //

  private initialize(): void {
    this.logger.trace(`Initialized`);
  }

  // This function properly handles the cursor that redis returns in sscan.
  // This is to make sure that all set members get read.
  private sscan(key: string, match = "", pattern = ""): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const messages: string[] = [];
      const recursiveSscanCB = (err: Error, result: [string, string[]]) => {
        if (err) reject(err);
        result[1].map((m: string) => {
          if (m != null) messages.push(m);
        });
        if (result[0] == "0") resolve(messages);
        this.client.sscan(key, result[0], match, pattern, recursiveSscanCB);
      };
      this.client.sscan(key, "0", match, pattern, recursiveSscanCB);
    });
  }
}
