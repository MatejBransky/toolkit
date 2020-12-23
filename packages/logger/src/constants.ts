export enum LogLevel {
  ALL = 0,
  TRACE = 100,
  DEBUG = 200,
  LOG = 200,
  INFO = 300,
  WARN = 400,
  ERROR = 500,
  SILENT = 600,
}

export enum LogMethod {
  TRACE = 'trace',
  DEBUG = 'debug',
  LOG = 'log',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export const DEFAULT_LEVEL = LogLevel.WARN;
