import { LogLevel, LogMethod } from './constants';

export interface LoggerFactory {
  getDefaultLevel: () => LogLevel;
  setDefaultLevel: (level: keyof typeof LogLevel) => void;
  getLogger: (name: string) => Logger;
  getLoggerCache: () => LoggerCache;
  setPrefix: (prefixer: Prefixer) => void;
  subscribe: (subscriber: Subscriber) => Unsubscribe;
}

export type Subscriber = (log: Log) => void;
type Unsubscribe = () => void;

export type Prefixer = (meta: LogMeta) => string;

export type LoggerCache = Record<string, { level?: LogLevel; logger: Logger }>;

export type Logger = Console & {
  setLevel: (level: keyof typeof LogLevel) => void;
  getLevel: () => LogLevel;
};

export type LogMeta = {
  loggerName: string;
  logLevel: LogMethod;
};

export type Log = LogMeta & {
  stackTrace?: string;
  date: Date;
  args: any[];
};

export type Formatter = (logMeta: LogMeta) => unknown;
