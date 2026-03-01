import SignOutButton from "@/app/components/sign-out-button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function TechnicianPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="bg-default-50 text-foreground min-h-screen p-8">
      <div className="mx-auto max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Technician Page</h1>
        <p>Login berhasil sebagai technician.</p>
        <p>Nama: {session?.user?.name ?? "-"}</p>
        <p>Username: {session?.user?.username ?? "-"}</p>
        <p>Role: {session?.user?.role ?? "-"}</p>
        <SignOutButton />
      </div>
    </main>
  );
}
