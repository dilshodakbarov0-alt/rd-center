import { cookies } from "next/headers";
import { getTranslations, type Locale } from "@/lib/i18n";

export const getLocaleFromCookies = (): Locale => {
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value;
  return locale === "uz" ? "uz" : "ru";
};

export const getPageDictionary = async () => {
  const locale = getLocaleFromCookies();
  const dictionary = await getTranslations(locale);
  return { locale, dictionary };
};
