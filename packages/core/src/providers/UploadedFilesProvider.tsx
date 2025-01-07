import React from "react";

import { IntlProvider } from "react-intl";

import { UploadedFilesManager } from "./UploadedFilesManager";
import de from "../translations/de.json";
import en from "../translations/en.json";
import { UploadedFilesProviderProps } from "../types";
import { Toaster } from "sonner";

const translations = { de, en };
const defaultLocale = "en" as const;

export const UploadedFilesProvider = (props: UploadedFilesProviderProps) => {
  const { children, locale } = props;

  // TODO: This is a temporary solution to flatten the messages.
  function flattenMessages(
    nestedMessages: any,
    prefix = ""
  ): Record<string, string> {
    return Object.keys(nestedMessages).reduce((messages, key) => {
      const value = nestedMessages[key];
      const prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        messages[prefixedKey] = value;
      } else {
        Object.assign(messages, flattenMessages(value, prefixedKey));
      }

      return messages;
    }, {} as Record<string, string>);
  }

  function getTranslation(locale?: string) {
    if (!locale || !(locale in translations)) {
      return translations[defaultLocale];
    }

    return translations[locale as keyof typeof translations];
  }

  return (
    <IntlProvider
      locale={locale ?? defaultLocale}
      messages={flattenMessages(getTranslation(locale))}
    >
      <Toaster expand visibleToasts={5} toastOptions={{ duration: 3500 }} />
      <UploadedFilesManager {...props}>{children}</UploadedFilesManager>
    </IntlProvider>
  );
};
