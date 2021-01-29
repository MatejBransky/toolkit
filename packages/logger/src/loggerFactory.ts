import { DEFAULT_LEVEL, LogLevel, LogMethod } from './constants';

export const defaultPrefixer: Prefixer = (logMeta) =>
  `[${logMeta.loggerName}][${logMeta.logLevel}]`;

export default (function loggerFactory(): LoggerFactory {
  let defaultLevel = DEFAULT_LEVEL;
  const subscribers: (Subscriber | null)[] = [];
  const loggerCache: LoggerCache = {};
  const noop = () => {};
  let prefixer = defaultPrefixer;

  return {
    subscribe(subscriber) {
      const index = subscribers.push(subscriber) - 1;
      return () => {
        subscribers[index] = null;
      };
    },
    setDefaultLevel(newDefaultLevel) {
      defaultLevel = LogLevel[newDefaultLevel];
    },
    getLoggerCache: () => loggerCache,
    getDefaultLevel: () => defaultLevel,
    setPrefix(newPrefixer) {
      prefixer = newPrefixer;
    },
    getLogger: (name) => {
      const logger = createLogger(name);
      loggerCache[name] = { level: undefined, logger };
      return logger;
    },
  };

  function createLogger(name: string) {
    const proxifiedLogger = new Proxy(globalThis.console, {
      get(target, propKey: LogMethod | string, receiver) {
        if (propKey === 'setLevel') {
          return (newLevel: keyof typeof LogLevel) => {
            loggerCache[name].level = LogLevel[newLevel];
          };
        }
        if (propKey === 'getLevel') {
          return () => loggerCache[name].level;
        }

        let targetValue;
        if (propKey === LogMethod.DEBUG && !(propKey in target)) {
          targetValue = Reflect.get(target, LogMethod.LOG, receiver);
        } else {
          targetValue = Reflect.get(target, propKey, receiver);
        }

        // handle log methods (.log(), .warn(), .error(), ...)
        if (Object.values(LogMethod).includes(propKey as LogMethod)) {
          const loggerMethod = propKey.toUpperCase() as keyof typeof LogLevel;
          const level = loggerCache[name].level ?? defaultLevel;

          // execute only logs if the same or a more detailed level is set
          if (level <= LogLevel[loggerMethod]) {
            const boundTargetValue = targetValue.bind(
              target,
              prefixer({
                loggerName: name,
                logLevel: propKey as LogMethod,
              })
            );

            /**
             * interrupt log execution if there are any subscriber
             * and publish log to all subcribers and then continue
             */
            if (subscribers.some((subscriber) => subscriber !== null)) {
              return (...args: any[]) => {
                const log: Log = {
                  loggerName: name,
                  logLevel: propKey as LogMethod,
                  stackTrace: new Error().stack,
                  date: new Date(),
                  args,
                };

                subscribers.forEach((subscriber) => {
                  if (subscriber) {
                    subscriber(log);
                  }
                });
                return Reflect.apply(boundTargetValue, target, args);
              };
            }

            // use bound version of Console with the specified prefix
            return boundTargetValue;
          }

          // suppress logs which are not allowed in the specified level
          return noop;
        }

        // return the rest of attributes and methods without any modification
        return targetValue;
      },
    });

    return proxifiedLogger as Logger;
  }
})();

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
