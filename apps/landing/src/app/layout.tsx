import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Sprawdź KSC — Czy Twoja firma podlega pod ustawę o KSC?",
  description: "Bezpłatny quiz klasyfikacyjny. Sprawdź, czy Twoja organizacja podlega pod Krajowy System Cyberbezpieczeństwa i jakie masz obowiązki.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
