import { RequestGenericInterface } from "fastify";
import { Logger } from "../lib/logger";

export interface HttpServiceOptions {
  logger?: string | Logger;
}

export interface PostSubscribeRequest extends RequestGenericInterface {
  Body: {
    topic: string;
    webhook: string;
  };
}
