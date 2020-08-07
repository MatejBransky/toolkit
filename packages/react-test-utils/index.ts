import React from 'react';
import '@testing-library/jest-dom';
import * as rtl from '@testing-library/react';

export * from '@testing-library/react';

export function render<
  C extends React.FC<any>,
  P extends React.ComponentProps<C>
>(Component: C, baseProps?: P) {
  let props = { ...baseProps };
  const utils = rtl.render(React.createElement(Component, props));

  return {
    ...utils,
    rerender: (newProps?: Partial<P>) => {
      props = { ...props, ...newProps };
      return utils.rerender(React.createElement(Component, props));
    },
  };
}
