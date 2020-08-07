import { render } from '@matejbransky/react-test-utils';

import App from '../src/App';

it('renders', () => {
  const { debug } = render(App);
  debug();
});
