import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "PyOrbit — Learn Python", template: "%s | PyOrbit" },
  description: "Clear, open-source lessons for learning Python from the beginning.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "PyOrbit",
    title: "PyOrbit — Learn Python",
    description: "Learn Python. Understand it. Build with it.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
