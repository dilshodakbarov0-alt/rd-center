import { supabaseServer } from "@/lib/supabase/server";

export type Locale = "ru" | "uz";

const fallbackDictionary: Record<Locale, Record<string, string>> = {
  ru: {
    "app.name": "R&D Center",
    "nav.dashboard": "Панель",
    "nav.components": "Компоненты",
    "nav.prices": "Цены",
    "nav.templates": "Шаблоны",
    "nav.settings": "Настройки",
    "nav.login": "Вход",
    "dashboard.title": "Проекты",
    "dashboard.filters": "Фильтры",
    "project.overview": "Обзор",
    "project.targets": "Цели и ограничения",
    "project.recipe": "Рецептура",
    "project.variants": "Варианты",
    "project.doe": "DOE / Лаб",
    "project.qc": "План контроля качества",
    "project.sop": "SOP",
    "project.economics": "Экономика",
    "project.documents": "Документы",
    "project.images": "Изображения",
    "actions.generate": "Сгенерировать",
    "actions.validate": "Проверить Gemini",
    "login.title": "Вход в систему",
    "settings.title": "Настройки",
    "components.title": "Библиотека компонентов",
    "prices.title": "Региональные цены",
    "templates.title": "Шаблоны документов",
    "language.ru": "Русский",
    "language.uz": "Ўзбекча",
    "warnings.eps": "EPS запрещён политикой проекта",
  },
  uz: {
    "app.name": "R&D Center",
    "nav.dashboard": "Boshqaruv",
    "nav.components": "Komponentlar",
    "nav.prices": "Narxlar",
    "nav.templates": "Shablonlar",
    "nav.settings": "Sozlamalar",
    "nav.login": "Kirish",
    "dashboard.title": "Loyihalar",
    "dashboard.filters": "Filtrlar",
    "project.overview": "Umumiy",
    "project.targets": "Maqsadlar va cheklovlar",
    "project.recipe": "Retsept",
    "project.variants": "Variantlar",
    "project.doe": "DOE / Laboratoriya",
    "project.qc": "Sifat nazorati reja",
    "project.sop": "SOP",
    "project.economics": "Iqtisodiyot",
    "project.documents": "Hujjatlar",
    "project.images": "Tasvirlar",
    "actions.generate": "Yaratish",
    "actions.validate": "Gemini tekshiruvi",
    "login.title": "Tizimga kirish",
    "settings.title": "Sozlamalar",
    "components.title": "Komponentlar kutubxonasi",
    "prices.title": "Hududiy narxlar",
    "templates.title": "Hujjat shablonlari",
    "language.ru": "Русский",
    "language.uz": "Ўзбекча",
    "warnings.eps": "EPS loyihada taqiqlangan",
  },
};

export const getTranslations = async (locale: Locale) => {
  const base = fallbackDictionary[locale] ?? fallbackDictionary.ru;
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return base;
  }

  const { data } = await supabaseServer
    .from("translations")
    .select("key,value")
    .eq("locale", locale);

  if (!data) {
    return base;
  }

  const dbDictionary = data.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

  return {
    ...base,
    ...dbDictionary,
  };
};

export const getTranslationValue = (dictionary: Record<string, string>, key: string) => {
  return dictionary[key] ?? key;
};
