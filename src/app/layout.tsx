import "./globals.css";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { getTranslations, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "R&D Center",
  description: "R&D Center for construction materials.",
};

const getLocale = (): Locale => {
  const cookieStore = cookies();
  const locale = cookieStore.get("locale")?.value;
  return locale === "uz" ? "uz" : "ru";
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = getLocale();
  const dictionary = await getTranslations(locale);

  return (
    <html lang={locale}>
      <body>
        <Header locale={locale} dictionary={dictionary} />
        <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
