import { formatToTimeZone } from "date-fns-timezone";

const chalk = require('chalk');

export type LogLevel = "trace" | "debug" | "info" | "warn" | "error";

export function getDefaultLogger(logLevel: string, context: any): Logger {
  const logger = new LoggerImpl(logLevel!!.toLowerCase() as LogLevel)
  logger.tag = context
  return logger
}

export function generateChildLogger(logger: Logger, context: any): Logger {
  logger = new LoggerImpl(logger.logLevel)
  logger.tag = context
  return logger
}

export interface Logger {
  readonly logLevel: LogLevel
  tag?: any
  trace(message: any)
  debug(message: any)
  info(message: any)
  warn(message: any)
  error(message: any)
  fatal(e: Error)
}

class LoggerImpl implements Logger {
  logLevel: LogLevel;
  tag?: any;
  constructor(
    logLevel: LogLevel, 
  ) {
    this.logLevel = logLevel;
  }

  public trace(message: any): void {
    if (this.logLevel !== "trace") return;
    const decorated = (typeof message === 'string') ? chalk.gray(message) : message
    this.tag ? this._trace(`${this.tag}`, decorated) : 
      this._trace(decorated);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _trace(...args: any[]): void {
    console.log(
      '[TRACE]',
      `${formatToTimeZone(new Date(), "YYYY-MM-DD HH:mm:ss.SSS", { timeZone: "Asia/Seoul" })}`,
      ...args,
    );
  }

  public debug(message: any): void {
    if (this.logLevel !== "trace" && this.logLevel !== "debug") return;
    const decorated = (typeof message === 'string') ? chalk.green(message) : message
    this.tag ? this._debug(`${this.tag}`, decorated) : 
      this._debug(decorated);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _debug(...args: any[]): void {
    console.debug(
      '[DEBUG]',
      `${formatToTimeZone(new Date(), "YYYY-MM-DD HH:mm:ss.SSS", { timeZone: "Asia/Seoul" })}`,
      ...args,
    );
  }

  public info(message: any): void {
    if (this.logLevel === "warn" || this.logLevel === "error") return;
    const decorated = (typeof message === 'string') ? chalk.cyan(message) : message
    this.tag ? this._info(`${this.tag}`, decorated) : 
      this._info(decorated);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _info(...args: any[]): void {
    console.info(
      '[INFO] ',
      `${formatToTimeZone(new Date(), "YYYY-MM-DD HH:mm:ss.SSS", { timeZone: "Asia/Seoul" })}`,
      ...args,
    );
  }

  public warn(message: any): void {
    if (this.logLevel === "error") return;
    const decorated = (typeof message === 'string') ? chalk.orange(message) : message
    this.tag ? this._warn(`${this.tag}`, decorated) : 
      this._warn(decorated);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _warn(...args: any[]): void {
    console.warn(
      '[WARN] ',
      `${formatToTimeZone(new Date(), "YYYY-MM-DD HH:mm:ss.SSS", { timeZone: "Asia/Seoul" })}`,
      ...args,
    );
  }

  public error(message: any): void {
    const decorated = (typeof message === 'string') ? chalk.bold.red(message) : message
    this.tag ? this._error(`${this.tag}`, decorated) : 
      this._error(decorated);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _error(...args: any[]): void {
    console.error(
      '[ERROR]',
      `${formatToTimeZone(new Date(), "YYYY-MM-DD HH:mm:ss.SSS", { timeZone: "Asia/Seoul" })}`,
      ...args,
    );
  }

  public fatal(e: Error): void {
    this.error(e.message);
  }
}
