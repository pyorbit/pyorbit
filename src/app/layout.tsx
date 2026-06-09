import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PyOrbit | Обучение Python",
  description: "Практическое веб-приложение для обучения Python.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
