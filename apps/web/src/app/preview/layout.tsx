import "./preview.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice preview",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
