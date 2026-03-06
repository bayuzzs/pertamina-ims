import { authOptions } from "@/lib/auth";
import { getAllUsers } from "@/services/user.service";
import type { User } from "@/types/user";
import { getServerSession } from "next-auth";
import AddUserModal from "./_components/add-user-modal";
import UsersTable from "./_components/users-table";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  let users: User[] = [];

  try {
    users = await getAllUsers({
      accessToken: session?.accessToken,
    });
  } catch {
    users = [];
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="bg-content1 border-default-200 rounded-2xl border p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              User Management
            </h1>
            <p className="text-default-500 mt-1 text-sm leading-relaxed">
              Manage system users and create technician accounts for operations.
            </p>
          </div>
          <AddUserModal accessToken={session?.accessToken} />
        </div>
      </section>

      <section className="bg-content1 border-default-200 rounded-2xl border p-3 sm:p-4">
        <div className="border-default-100 mb-3 border-b px-2 pb-3 sm:mb-4 sm:px-3">
          <p className="text-foreground text-sm font-semibold">Users List</p>
          <p className="text-default-500 mt-0.5 text-xs">
            Showing all registered users with name, position, and account
            status.
          </p>
        </div>
        <UsersTable users={users} accessToken={session?.accessToken} />
      </section>
    </div>
  );
}
