import React from 'react';
import type { FormatMessageOptions, Locale } from '@eo-locale/core';
import { TranslationsProvider, useTranslator } from '@eo-locale/react';
import { loggerFactory } from '@matejbransky/logger';

import { useRequest, Status } from './useRequest';

const log = loggerFactory.getLogger('@matejbransky/react-intl');

export const IntlProvider: React.FC<IntlProps> = (props) => {
  const folderPath = props.path ?? '/locales';
  const request = useRequest<Locale[]>(
    `${folderPath}/${props.locale}.json`,
    (path: string) => {
      if (props.messages) {
        log.debug('messages are loaded from the "props.messages"');
        return Promise.resolve([
          { language: props.locale, messages: props.messages },
        ]);
      }

      return fetchMessages(path).catch(() => {
        log.info(
          `Falling back to the fallbackLocale "${props.fallbackLocale}"...`
        );
        const fallbackPath = `${folderPath}/${props.fallbackLocale}.json`;
        return fetchMessages(fallbackPath);
      });

      async function fetchMessages(messagesPath: string) {
        return fetch(messagesPath)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            return response.json().then(Promise.reject);
          })
          .then<Locale[]>(
            (response) => {
              log.debug({ messages: response });
              return [{ language: props.locale, messages: response }];
            },
            (error) => {
              log.error(
                `Error during the request of the locale "${props.locale}" at the path: "${messagesPath}". Error:`,
                error.message
              );
              throw new Error(error);
            }
          );
      }
    }
  );

  if (request.status === Status.SUCCESS) {
    return (
      <TranslationsProvider language={props.locale} locales={request.response}>
        {props.children}
      </TranslationsProvider>
    );
  }

  return null;
};

type IntlProps = {
  fallbackLocale: string;
  locale: string;
  path?: string;
  messages?: Record<string, string>;
};

export const useIntl = () => {
  const translator = useTranslator();
  const translate = translator.translate.bind(translator) as Translate;

  return {
    ...translator,
    translate,
    t: translate,
  };
};

type Translate = (id: string, options?: FormatMessageOptions) => string;
