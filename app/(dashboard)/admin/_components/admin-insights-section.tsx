import Link from "next/link";
import { MdGroup } from "react-icons/md";

type AdminInsightsSectionProps = {
  activeItems: number;
  discontinuedItems: number;
  stockCoverage: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  userAvailability: number;
  outOfStockItems: number;
  pendingRequests: number;
  urgentIssues: number;
};

export default function AdminInsightsSection({
  activeItems,
  discontinuedItems,
  stockCoverage,
  totalUsers,
  activeUsers,
  inactiveUsers,
  userAvailability,
  outOfStockItems,
  pendingRequests,
  urgentIssues,
}: AdminInsightsSectionProps) {
  return (
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
            <p className="text-success mt-1 text-lg font-bold">{activeUsers}</p>
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
              <p className="text-default-500 text-xs">Waiting admin decision</p>
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
  );
}
