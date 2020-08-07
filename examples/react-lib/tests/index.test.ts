import { render } from '@matejbransky/react-test-utils';

import { Foobar } from '../src';

it('renders', () => {
  const { debug } = render(Foobar);
  debug();
});
