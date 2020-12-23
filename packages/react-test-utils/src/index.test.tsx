import React, { useState } from 'react';
import * as rtl from '@testing-library/react';

import { render, screen, fireEvent } from './';

const Counter: React.FC<{ name?: string; initialValue?: number }> = ({
  name = 'anonymous',
  initialValue = 0,
}) => {
  const [value, setValue] = useState(initialValue);

  return (
    <div>
      <h2>Counter: {name}</h2>
      <p>
        Value: <span data-testid="value">{value}</span>
      </p>
      <button onClick={() => setValue(value + 1)}>Increment</button>
    </div>
  );
};

describe('enhanced render() method', () => {
  it('returns the same API methods names as in @testing-library/react', () => {
    const rtlUtils = rtl.render(<Counter />);
    const utils = render(<Counter />);

    expect(Object.keys(utils)).toEqual(
      expect.arrayContaining(Object.keys(rtlUtils))
    );
  });

  describe('enhanced rerender() method', () => {
    it('remembers element from the render() method', () => {
      const { rerender } = render(<Counter />);
      fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
      rerender();
      expect(screen.getByTestId('value')).toHaveTextContent('1');
    });

    it('remembers original props from the render() method', () => {
      const { rerender } = render(<Counter name="Foobar" />);
      fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
      rerender();
      expect(screen.getByText('Counter: Foobar')).toBeInTheDocument();
    });

    it('updates props from the previous render', () => {
      const { rerender } = render(<Counter name="Foobar" initialValue={2} />);
      fireEvent.click(screen.getByRole('button', { name: 'Increment' }));
      rerender({ name: 'Boom' });
      expect(screen.getByText('Counter: Boom')).toBeInTheDocument();
      expect(screen.getByTestId('value')).toHaveTextContent('3');
    });
  });
});
