import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import AdminDashboardShell from "./_components/admin-dashboard-shell";
import TechnicianDashboardShell from "./_components/technician-dashboard-shell";

type Role = "admin" | "technician";

const isRole = (value: unknown): value is Role => {
  return value === "admin" || value === "technician";
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const role = isRole(session?.user?.role) ? session.user.role : "admin";
  const userName = session?.user?.name ?? session?.user?.username ?? "User";

  if (role === "technician") {
    return (
      <TechnicianDashboardShell userName={userName}>
        {children}
      </TechnicianDashboardShell>
    );
  }

  return (
    <AdminDashboardShell userName={userName}>{children}</AdminDashboardShell>
  );
}
