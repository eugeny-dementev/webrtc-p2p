import { injectable } from "inversify";

type Meta = {
  [key: string]: any
}

type LogMethod = (message: string, meta: Meta) => void;

type ErrorMeta = {
  error: Error,
} & Meta;

type ErrorMethod = (message: string, meta: ErrorMeta) => void;

interface ILogger {
  error: ErrorMethod
  warn: LogMethod
  info: LogMethod
  debug: LogMethod
}

@injectable()
export class PrettyLogger implements ILogger {
  error(message: string, meta: ErrorMeta) {
  }

  warn(message: string, meta: Meta) {
  }

  info(message: string, meta: Meta) {
  }

  debug(message: string, meta: Meta) {
  }
}
