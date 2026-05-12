import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "STROYGEN CORE",
  description: "Laboratory of Autonomous Engineering",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-black min-h-screen">{children}</body>
    </html>
  );
}
