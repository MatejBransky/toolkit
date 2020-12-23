# @matejbransky/logger

Proxy based logger which can change log level during runtime. It was inspired by the package [`loglevel`](https://github.com/pimterry/loglevel).

## Usage

```
npm install @matejbransky/logger
```

```js
import { loggerFactory } from '@matejbransky/logger';

const log = loggerFactory.getLogger('foobar');

log.info('Hello World!'); // => prints [foobar][info]: Hello World!
```

## API

Similar to [loglevel docs](https://github.com/pimterry/loglevel#documentation).
Differences are covered in [tests](./src/loggerFactory.test.ts).

## Missing features

- log levels are not stored in local storage
