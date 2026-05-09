import { requireProfile } from "@/lib/auth";
import NavBar from "@/components/NavBar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar fullName={profile.full_name} role={profile.role} />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
