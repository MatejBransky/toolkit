import React from 'react';
import '@testing-library/jest-dom';
import * as rtl from '@testing-library/react';

export * from '@testing-library/react';

export function render<P extends Record<string, unknown>>(
  element: React.ReactElement<P>
) {
  const baseProps = element.props;
  let props = { ...baseProps };
  const utils = rtl.render(element);

  return {
    ...utils,
    rerender(newProps?: React.PropsWithChildren<Partial<P>>) {
      props = { ...props, ...newProps };
      const clone = React.cloneElement(element, props);
      return utils.rerender(clone);
    },
  };
}
