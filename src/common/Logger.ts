import { injectable } from "inversify";
import yamlifyObject from 'yamlify-object'

type Meta = {
  [key: string]: any
}

type LogMethod = (message: string, meta: Meta) => void;

type ErrorMeta = {
  error: Error,
} & Meta;

type ErrorMethod = (message: string, meta: ErrorMeta) => void;

export interface ILogger {
  error: ErrorMethod
  warn: LogMethod
  info: LogMethod
  debug: LogMethod
}

@injectable()
export class PrettyLogger implements ILogger {
  constructor(){
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.info = this.info.bind(this);
    this.debug = this.debug.bind(this);
  }

  error(message: string, meta: ErrorMeta) {
    this.log('error', message, meta);
  }

  warn(message: string, meta: Meta) {
    this.log('warn', message, meta);
  }

  info(message: string, meta: Meta) {
    this.log('info', message, meta);
  }

  debug(message: string, meta: Meta) {
    this.log('debug', message, meta);
  }

  log(level: 'error' | 'warn' | 'info' | 'debug', message: string, meta: Meta) {
    console.log(`[${level}] - ${message}\n${yamlifyObject(meta)}`);
  }
}
