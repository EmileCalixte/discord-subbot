import { LocaleString, LocalizationMap } from "discord.js";

type DefaultLocale = "en-US";

/**
 * A {@see LocalizationMap} object with a default locale
 */
export type LocalizationMapWithDefault = LocalizationMap & {
  [key in DefaultLocale]: string;
};

export function getLocaleString(locale: LocaleString, localizationMap: LocalizationMapWithDefault): string {
  if (!(locale in localizationMap)) {
    return localizationMap["en-US"];
  }

  if (!localizationMap[locale]) {
    return localizationMap["en-US"];
  }

  return localizationMap[locale] as string;
}
