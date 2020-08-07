import React, { useState } from 'react';

import { render, screen, fireEvent } from '.';

const Counter = () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <h2>Counter</h2>
      <p>
        Value: <span data-testid="value">{value}</span>
      </p>
      <button onClick={() => setValue(value + 1)}>Increment</button>
    </div>
  );
};

it('renders', () => {
  const { debug, rerender } = render(Counter);
  debug();
  fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
  rerender();
  debug();
  expect(screen.getByTestId('value')).toHaveTextContent('1');
});
