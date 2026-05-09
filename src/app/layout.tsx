import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orquestra — Gestão de aulas",
  description:
    "Sistema de gestão de aulas, níveis e progresso para grupos de música da igreja.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
