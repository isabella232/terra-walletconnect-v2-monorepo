import fastify, { FastifyInstance } from "fastify";
import helmet from "fastify-helmet";
import pino, { Logger } from "pino";
import { getDefaultLoggerOptions, generateChildLogger } from "@pedrouid/pino-utils";

import config from "./config";
import { assertType } from "./utils";
import { HttpServiceOptions, GetTestRequest } from "./types";
import { isServerAvailable, testRelayProvider, testLegacyProvider, isModeSupported } from "./tests";

export class HttpService {
  public app: FastifyInstance;
  public logger: Logger;

  public context = "server";

  constructor(opts: HttpServiceOptions) {
    const logger =
      typeof opts?.logger !== "undefined" && typeof opts?.logger !== "string"
        ? opts.logger
        : pino(getDefaultLoggerOptions({ level: opts?.logger }));
    this.app = fastify({ logger });
    this.logger = generateChildLogger(logger, this.context);
    this.initialize();
  }

  // ---------- Private ----------------------------------------------- //

  private initialize(): void {
    this.logger.trace(`Initialized`);

    this.app.register(helmet);

    this.app.get("/health", (_, res) => {
      res.status(200).send();
    });

    this.app.get("/hello", (_, res) => {
      res
        .status(200)
        .send(`Hello World, this is Health Server v${config.VERSION}@${config.GITHASH}`);
    });

    this.app.get<GetTestRequest>("/test", async (req, res) => {
      try {
        assertType(req, "query", "object");
        assertType(req.query, "url");

        const { url } = req.query;
        const legacy = req.query?.legacy === "true";
        const mode = legacy ? "legacy" : "jsonrpc";

        this.logger.info(`Testing Relay provider at ${url} with ${mode} mode`);

        if (!(await isServerAvailable(url))) {
          res.status(400).send({ message: `Relay provider at ${url} is not available` });
          return;
        }

        if (!(await isModeSupported(url, mode))) {
          res
            .status(400)
            .send({ message: `Relay provider at ${url} does not support ${mode} mode` });
          return;
        }

        const result = legacy
          ? await testLegacyProvider(url)
          : await testRelayProvider(url, req.query.url2);
        res.status(200).send({ mode, ...result });
      } catch (e) {
        res.status(400).send({ message: `Error: ${e.message}` });
      }
    });
  }
}
