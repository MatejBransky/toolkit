import { LogLevel, LogMethod } from './constants';
import loggerFactory, { defaultPrefixer, Log } from './loggerFactory';

describe('logger', () => {
  let consoleSpy = {} as Record<LogMethod, jest.SpyInstance>;

  beforeAll(() => {
    loggerFactory.setDefaultLevel('ALL');
  });

  beforeEach(() => {
    /**
     * suppresses logs during tests
     * and keep their mocks so you can do any assertions on them
     */
    Object.values(LogMethod).forEach((type) => {
      consoleSpy[type] = jest.spyOn(console, type).mockImplementation(() => {});
    });
  });

  afterEach(() => {
    // restore the standard behavior of the console
    Object.values(LogMethod).forEach((type) => {
      consoleSpy[type].mockRestore();
    });
  });

  describe('loggerFactory.setPrefix() - set custom prefix', () => {
    it('has default prefix', () => {
      const logger = loggerFactory.getLogger('test-prefix');

      logger.log('test');

      expect(consoleSpy.log).toHaveBeenCalledWith('[test-prefix][log]', 'test');
    });

    it('allows custom prefix', () => {
      const logger = loggerFactory.getLogger('test-prefix');
      loggerFactory.setPrefix(
        (logMeta) => `(${logMeta.loggerName})(${logMeta.logLevel})`
      );

      logger.log('test');

      expect(consoleSpy.log).toHaveBeenCalledWith('(test-prefix)(log)', 'test');

      loggerFactory.setPrefix(defaultPrefixer);
    });
  });

  describe('log methods', () => {
    const levels = Object.entries(LogLevel).filter(([x]) => isNaN(Number(x)));

    Object.entries(LogMethod).forEach(([logLevel, logMethod]) => {
      describe(`logger.${logMethod}(), level: ${logLevel}`, () => {
        levels.forEach(([levelName, levelNumber]) => {
          const isCalled =
            levelNumber <= LogLevel[logLevel as keyof typeof LogMethod];

          test(`logger.setLevel('${levelName}'): ${
            isCalled ? 'called' : '-'
          }`, () => {
            const loggerName = `test-method`;
            const logger = loggerFactory.getLogger(loggerName);

            logger.setLevel(levelName as keyof typeof LogLevel);
            logger[logMethod]('test');

            if (isCalled) {
              expect(consoleSpy[logMethod]).toHaveBeenCalledTimes(1);
              expect(consoleSpy[logMethod]).toHaveBeenCalledWith(
                `[${loggerName}][${logMethod}]`,
                'test'
              );
            } else {
              expect(consoleSpy[logMethod]).not.toHaveBeenCalled();
            }
          });
        });
      });
    });
  });

  describe('loggerFactory.getLogger(loggerName)', () => {
    it('creates new logger', () => {
      let loggerCache = loggerFactory.getLoggerCache();

      expect(loggerCache['foobar']).toBeUndefined();

      const logger = loggerFactory.getLogger('foobar');

      loggerCache = loggerFactory.getLoggerCache();

      expect(loggerCache['foobar']).toBeDefined();
      expect(loggerCache['foobar'].logger).toBe(logger);
    });

    it('returns cached logger', () => {
      // creates new logger and saves it in loggerCache
      loggerFactory.getLogger('bongo');

      const loggerCache = loggerFactory.getLoggerCache();
      // returns cached logger
      const logger = loggerFactory.getLogger('bongo');

      expect(loggerCache['bongo'].logger).toBe(logger);
    });
  });

  test('loggerFactory.subscribe(subscriber) - subscribes to logging', () => {
    const logger = loggerFactory.getLogger('test-subscriber');
    const subscriber = jest.fn();

    const unsubscribe = loggerFactory.subscribe(subscriber);
    logger.log('test');

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(
      expect.objectContaining<Log>({
        loggerName: 'test-subscriber',
        logLevel: LogMethod.LOG,
        date: expect.any(Date),
        args: ['test'],
      })
    );
    expect(consoleSpy.log).toHaveBeenCalledTimes(1);
    expect(consoleSpy.log).toHaveBeenCalledWith(
      '[test-subscriber][log]',
      'test'
    );

    unsubscribe();
    logger.log('test 2');

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(consoleSpy.log).toHaveBeenCalledTimes(2);
    expect(consoleSpy.log).toHaveBeenCalledWith(
      '[test-subscriber][log]',
      'test 2'
    );
  });
});
