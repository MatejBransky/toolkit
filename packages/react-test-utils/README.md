# @matejbransky/react-test-utils

Utilities for testing React components. It's based on [`@testing-library/react`](https://testing-library.com/react) which provides light utility functions on top of [`react-dom`](https://reactjs.org/docs/react-dom.html) and [`react-dom/test-utils`](https://reactjs.org/docs/test-utils.html) in a way that encourages better testing practices. Its primary guiding principle is:

> [The more your tests resemble the way your software is used, the more confidence they can give you.](https://twitter.com/kentcdodds/status/977018512689455106)

In addition to [reexported utilities `@matejbransky/react-test-utils`](https://testing-library.com/docs/react-testing-library/api) enhances API and adds another useful functions.

## Getting started

Requirements:

- [Node.js](https://nodejs.org/)
- [npm](https://docs.npmjs.com/about-npm)/[Yarn](https://classic.yarnpkg.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [`jest`](https://jestjs.io/)
- `@matejbransky/jest-preset`

Installation:

```
yarn add @matejbransky/react-test-utils
```

## Additional API to `@testing-library/react`

### `rerender(newProps: Record<string, unknown>): void`

It's enhanced version of the original [`rerender()` method from `@testing-library/react`](https://testing-library.com/docs/react-testing-library/api#rerender). Enhanced version accepts only new components props so you don't need to repeat JSX signature with all original props + new props.

Example:

```jsx
const { rerender } = render(<Counter name="Foobar" initialValue={4} />);

// re-render the same component with the original props and new props
rerender({ name: 'Bongo' });
```

_Note: component's [ref persists rerenders thanks to the `React.cloneElement()` method](https://reactjs.org/docs/react-api.html#cloneelement)._
