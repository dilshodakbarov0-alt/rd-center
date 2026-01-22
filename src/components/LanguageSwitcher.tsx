"use client";

import { useState } from "react";

const options = [
  { value: "ru", label: "Русский" },
  { value: "uz", label: "Ўзбекча" },
];

export const LanguageSwitcher = ({ initialLocale }: { initialLocale: string }) => {
  const [locale, setLocale] = useState(initialLocale);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    setLocale(nextLocale);
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <select
      value={locale}
      onChange={onChange}
      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
