import React from 'react';
import fetchMock from 'fetch-mock-jest';
import { render, screen, waitFor } from '@matejbransky/react-test-utils';
import { loggerFactory } from '@matejbransky/logger';

import { IntlProvider, useIntl } from './';

const locale = 'en-US';
const messages = {
  title: 'My Title',
  description: "It's about {placeholder}.",
  country: 'Country: {country}',
};

const App = ({
  fallbackLocale,
  locale,
  path,
  messages,
}: {
  fallbackLocale: string;
  locale: string;
  path?: string;
  messages?: Record<string, string>;
}) => {
  return (
    <IntlProvider
      fallbackLocale={fallbackLocale}
      locale={locale}
      path={path}
      messages={messages}
    >
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
  afterEach(() => {
    fetchMock.mockReset();
  });

  it('loads messages for the configured locale', async () => {
    const folderPath = '/locales';
    const getLocalePath = (locale: string) => `${folderPath}/${locale}.json`;

    fetchMock.get(getLocalePath('en-US'), messages);

    render(<App fallbackLocale="cs-CZ" locale="en-US" path={folderPath} />);

    await waitFor(() => screen.getByTestId('Content'));

    expect(screen.getByTestId('title')).toHaveTextContent(messages.title);
  });

  it('falls back to the fallbackLocale in the case of some error during fetching messages', async () => {
    const folderPath = '/locales';
    const getLocalePath = (locale: string) => `${folderPath}/${locale}.json`;

    fetchMock
      .get(getLocalePath('cs-CZ'), () => {
        throw new Error('not found');
      })
      .get(getLocalePath('en-US'), messages);

    loggerFactory.setDefaultLevel('SILENT');

    render(<App fallbackLocale="en-US" locale="cs-CZ" path={folderPath} />);

    await waitFor(() => screen.getByTestId('Content'));

    expect(screen.getByTestId('title')).toHaveTextContent(messages.title);

    loggerFactory.setDefaultLevel('WARN');
  });

  it(`translates components (locale: ${locale})`, async () => {
    render(<App fallbackLocale="en-US" locale={locale} messages={messages} />);

    await waitFor(() => screen.getByTestId('Content'));

    expect(screen.getByTestId('title')).toHaveTextContent(messages.title);
    expect(screen.getByTestId('description')).toHaveTextContent(
      messages.description.replace('{placeholder}', 'intlContext')
    );
  });
});
