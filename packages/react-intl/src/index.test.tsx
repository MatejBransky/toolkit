import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@matejbransky/react-test-utils';

import { IntlProvider, useIntl } from './';

const locale = 'en-US';
const messages = {
  title: 'My Title',
  description: "It's about {placeholder}.",
  country: 'Country: {country}',
};

const App = ({
  locale,
  messages,
}: {
  locale: string;
  messages: Record<string, string>;
}) => {
  return (
    <IntlProvider locale={locale} messages={messages}>
      <Content />
    </IntlProvider>
  );
};

const Content = () => {
  const intl = useIntl();

  return (
    <div data-testid="Content">
      <h1 data-testid="title">{intl.translate('title')}</h1>
      <p data-testid="description">
        {intl.translate('description', { placeholder: 'intlContext' })}
      </p>
    </div>
  );
};

describe('intlContext', () => {
  it(`translates components (locale: ${locale})`, async () => {
    render(<App locale={locale} messages={messages} />);

    await waitFor(() => screen.getByTestId('Content'));

    expect(screen.getByTestId('title', undefined)).toHaveTextContent(
      messages.title
    );
    expect(screen.getByTestId('description')).toHaveTextContent(
      messages.description.replace('{placeholder}', 'intlContext')
    );
  });
});
