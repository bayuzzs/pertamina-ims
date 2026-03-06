import { authOptions } from "@/lib/auth";
import { getPendingInventoryMovements } from "@/services/inventory-movement.service";
import { getAllItems } from "@/services/item.service";
import { getAllUsers } from "@/services/user.service";
import { getServerSession } from "next-auth";
import Link from "next/link";
import {
  MdArrowOutward,
  MdErrorOutline,
  MdGroup,
  MdInventory2,
  MdPendingActions,
  MdWarningAmber,
} from "react-icons/md";

const STOCK_THIN_THRESHOLD = 30;

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  let totalItems = 0;
  let lowStockItems = 0;
  let outOfStockItems = 0;
  let activeItems = 0;
  let discontinuedItems = 0;
  let totalUsers = 0;
  let activeUsers = 0;
  let inactiveUsers = 0;
  let pendingRequests = 0;

  try {
    const [itemsResponse, users, pendingResponse] = await Promise.all([
      getAllItems({
        accessToken: session?.accessToken,
        page: 1,
        limit: 1000,
      }),
      getAllUsers({
        accessToken: session?.accessToken,
      }),
      getPendingInventoryMovements({
        accessToken: session?.accessToken,
        page: 1,
        limit: 1,
      }),
    ]);

    totalItems = itemsResponse.pagination.total;
    lowStockItems = itemsResponse.data.filter(
      (item) => item.stock > 0 && item.stock <= STOCK_THIN_THRESHOLD,
    ).length;
    outOfStockItems = itemsResponse.data.filter(
      (item) => item.stock <= 0,
    ).length;
    activeItems = itemsResponse.data.filter(
      (item) => item.status === "active",
    ).length;
    discontinuedItems = itemsResponse.data.filter(
      (item) => item.status === "discontinued",
    ).length;

    totalUsers = users.length;
    activeUsers = users.filter((user) => user.status === "ACTIVE").length;
    inactiveUsers = users.filter((user) => user.status === "INACTIVE").length;

    pendingRequests = pendingResponse.pagination.total;
  } catch {
    totalItems = 0;
    lowStockItems = 0;
    outOfStockItems = 0;
    activeItems = 0;
    discontinuedItems = 0;
    totalUsers = 0;
    activeUsers = 0;
    inactiveUsers = 0;
    pendingRequests = 0;
  }

  const stockCoverage =
    totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 0;
  const userAvailability =
    totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  const urgentIssues = outOfStockItems + pendingRequests + inactiveUsers;

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="bg-content1 border-default-200 rounded-2xl border p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Operation Control Center
            </h1>
            <p className="text-default-500 mt-1 text-sm leading-relaxed">
              Prioritize critical stock issues, process pending requests faster,
              and keep technician accounts ready for field operations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/stock-requests"
              className="bg-primary text-primary-foreground inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold"
            >
              Review Requests
            </Link>
            <Link
              href="/admin/inventory"
              className="bg-default-100 text-foreground inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold"
            >
              Open Inventory
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
          <p className="text-default-500 flex items-center gap-1 text-xs font-semibold uppercase">
            <MdInventory2 size={14} /> Total Items
          </p>
          <p className="text-foreground mt-2 text-2xl font-bold">
            {totalItems}
          </p>
          <p className="text-default-500 mt-1 text-xs">
            Registered inventory items
          </p>
        </div>

        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
          <p className="text-default-500 flex items-center gap-1 text-xs font-semibold uppercase">
            <MdWarningAmber size={14} /> Low Stock
          </p>
          <p className="text-warning mt-2 text-2xl font-bold">
            {lowStockItems}
          </p>
          <p className="text-default-500 mt-1 text-xs">
            Stock ≤ {STOCK_THIN_THRESHOLD} and still available
          </p>
        </div>

        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
          <p className="text-default-500 flex items-center gap-1 text-xs font-semibold uppercase">
            <MdErrorOutline size={14} /> Out of Stock
          </p>
          <p className="text-danger mt-2 text-2xl font-bold">
            {outOfStockItems}
          </p>
          <p className="text-default-500 mt-1 text-xs">
            Items requiring immediate refill
          </p>
        </div>

        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
          <p className="text-default-500 flex items-center gap-1 text-xs font-semibold uppercase">
            <MdPendingActions size={14} /> Pending Requests
          </p>
          <p className="text-primary mt-2 text-2xl font-bold">
            {pendingRequests}
          </p>
          <p className="text-default-500 mt-1 text-xs">
            Awaiting admin confirmation
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
          <p className="text-foreground text-sm font-semibold">
            Inventory Health
          </p>
          <p className="text-default-500 mt-0.5 text-xs">
            Active item ratio and stock readiness snapshot.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="bg-default-100 rounded-xl p-3">
              <p className="text-default-500 text-xs">Active Items</p>
              <p className="text-foreground mt-1 text-lg font-bold">
                {activeItems}
              </p>
            </div>
            <div className="bg-default-100 rounded-xl p-3">
              <p className="text-default-500 text-xs">Discontinued Items</p>
              <p className="text-foreground mt-1 text-lg font-bold">
                {discontinuedItems}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-default-500 text-xs">Stock Coverage</p>
              <p className="text-foreground text-xs font-semibold">
                {stockCoverage}%
              </p>
            </div>
            <div className="bg-default-100 h-2 w-full rounded-full">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${stockCoverage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
          <p className="text-foreground text-sm font-semibold">User Summary</p>
          <p className="text-default-500 mt-0.5 text-xs">
            Technician account status and availability snapshot.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="bg-default-100 rounded-xl p-3">
              <p className="text-default-500 text-xs">Total Users</p>
              <p className="text-foreground mt-1 text-lg font-bold">
                {totalUsers}
              </p>
            </div>
            <div className="bg-default-100 rounded-xl p-3">
              <p className="text-default-500 text-xs">Active</p>
              <p className="text-success mt-1 text-lg font-bold">
                {activeUsers}
              </p>
            </div>
            <div className="bg-default-100 rounded-xl p-3">
              <p className="text-default-500 text-xs">Inactive</p>
              <p className="text-default-700 mt-1 text-lg font-bold">
                {inactiveUsers}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-default-500 text-xs">User Availability</p>
              <p className="text-foreground text-xs font-semibold">
                {userAvailability}%
              </p>
            </div>
            <div className="bg-default-100 h-2 w-full rounded-full">
              <div
                className="bg-success h-2 rounded-full"
                style={{ width: `${userAvailability}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
          <p className="text-foreground text-sm font-semibold">
            Attention Required
          </p>
          <p className="text-default-500 mt-0.5 text-xs">
            Focus on these queues to keep operations smooth.
          </p>

          <div className="mt-4 space-y-2">
            <Link
              href="/admin/inventory"
              className="bg-default-100 hover:bg-default-200 flex items-center justify-between rounded-xl px-3 py-2 transition-colors"
            >
              <div>
                <p className="text-foreground text-sm font-semibold">
                  Out-of-stock items
                </p>
                <p className="text-default-500 text-xs">
                  Require restock planning
                </p>
              </div>
              <p className="text-danger ml-3 text-sm font-bold">
                {outOfStockItems}
              </p>
            </Link>

            <Link
              href="/admin/stock-requests"
              className="bg-default-100 hover:bg-default-200 flex items-center justify-between rounded-xl px-3 py-2 transition-colors"
            >
              <div>
                <p className="text-foreground text-sm font-semibold">
                  Pending requests
                </p>
                <p className="text-default-500 text-xs">
                  Waiting admin decision
                </p>
              </div>
              <p className="text-warning ml-3 text-sm font-bold">
                {pendingRequests}
              </p>
            </Link>

            <Link
              href="/admin/users"
              className="bg-default-100 hover:bg-default-200 flex items-center justify-between rounded-xl px-3 py-2 transition-colors"
            >
              <div>
                <p className="text-foreground text-sm font-semibold">
                  Inactive technicians
                </p>
                <p className="text-default-500 text-xs">
                  May impact field response
                </p>
              </div>
              <p className="text-default-700 ml-3 text-sm font-bold">
                {inactiveUsers}
              </p>
            </Link>
          </div>

          <div className="border-default-200 mt-4 rounded-xl border p-3">
            <p className="text-default-500 text-xs">Urgent queue count</p>
            <p className="text-foreground mt-1 flex items-center gap-1 text-lg font-bold">
              <MdGroup size={18} /> {urgentIssues}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
        <p className="text-foreground text-sm font-semibold">Quick Actions</p>
        <p className="text-default-500 mt-0.5 text-xs">
          Use direct navigation for daily admin workflows.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Link
            href="/admin/inventory"
            className="bg-primary text-primary-foreground inline-flex h-11 items-center justify-between rounded-xl px-4 text-sm font-semibold"
          >
            Open Inventory <MdArrowOutward size={16} />
          </Link>
          <Link
            href="/admin/stock-requests"
            className="bg-default-100 text-foreground inline-flex h-11 items-center justify-between rounded-xl px-4 text-sm font-semibold"
          >
            Review Stock Requests <MdArrowOutward size={16} />
          </Link>
          <Link
            href="/admin/users"
            className="bg-default-100 text-foreground inline-flex h-11 items-center justify-between rounded-xl px-4 text-sm font-semibold"
          >
            Manage Users <MdArrowOutward size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
