import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "KSCSYSTEM — Platforma zgodności z KSC",
  description: "Zarządzaj zgodnością Twojej firmy z ustawą o Krajowym Systemie Cyberbezpieczeństwa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
