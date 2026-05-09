"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";

const links: { href: string; label: string; maestroOnly?: boolean }[] = [
  { href: "/dashboard", label: "Início" },
  { href: "/musicos", label: "Músicos", maestroOnly: true },
  { href: "/niveis", label: "Níveis" },
  { href: "/aulas", label: "Aulas" },
  { href: "/turmas", label: "Turmas" },
];

export default function NavBar({
  fullName,
  role,
}: {
  fullName: string;
  role: UserRole;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-lg font-bold text-brand-700">
          Orquestra
        </Link>

        <nav className="hidden gap-1 sm:flex">
          {links
            .filter((l) => !l.maestroOnly || role === "maestro")
            .map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-600 sm:inline">
            {fullName} · <span className="capitalize">{role}</span>
          </span>
          <button onClick={logout} className="btn-secondary">
            Sair
          </button>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-gray-100 px-4 py-2 sm:hidden">
        {links
          .filter((l) => !l.maestroOnly || role === "maestro")
          .map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ${
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
      </nav>
    </header>
  );
}
