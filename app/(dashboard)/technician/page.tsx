import { authOptions } from "@/lib/auth";
import { getMyInventoryMovements } from "@/services/inventory-movement.service";
import { getAllItems } from "@/services/item.service";
import { getServerSession } from "next-auth";
import Link from "next/link";
import {
  MdArrowOutward,
  MdChecklist,
  MdInfoOutline,
  MdPendingActions,
  MdTaskAlt,
  MdWarningAmber,
} from "react-icons/md";

const STOCK_THIN_THRESHOLD = 30;

export default async function TechnicianDashboardPage() {
  const session = await getServerSession(authOptions);

  let totalRequests = 0;
  let pendingRequests = 0;
  let approvedRequests = 0;
  let rejectedRequests = 0;
  let lowStockWatchlist: Array<{
    id: string;
    name: string;
    itemNo: string;
    stock: number;
    unit: string;
  }> = [];

  const [myRequestsResult, itemsResult] = await Promise.allSettled([
    getMyInventoryMovements({
      accessToken: session?.accessToken,
      page: 1,
      limit: 1000,
    }),
    getAllItems({
      accessToken: session?.accessToken,
      page: 1,
      limit: 1000,
    }),
  ]);

  if (myRequestsResult.status === "fulfilled") {
    totalRequests = myRequestsResult.value.pagination.total;
    pendingRequests = myRequestsResult.value.data.filter(
      (request) => request.status === "pending",
    ).length;
    approvedRequests = myRequestsResult.value.data.filter(
      (request) => request.status === "approved",
    ).length;
    rejectedRequests = myRequestsResult.value.data.filter(
      (request) => request.status === "rejected",
    ).length;
  }

  if (itemsResult.status === "fulfilled") {
    lowStockWatchlist = itemsResult.value.data
      .filter(
        (item) =>
          item.status === "active" && item.stock <= STOCK_THIN_THRESHOLD,
      )
      .sort((first, second) => first.stock - second.stock)
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        name: item.name,
        itemNo: item.itemNo,
        stock: item.stock,
        unit: item.unit,
      }));
  }

  const completionRate =
    totalRequests > 0
      ? Math.round((approvedRequests / totalRequests) * 100)
      : 0;
  const needsFollowUp = pendingRequests + rejectedRequests;

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="bg-content1 border-default-200 rounded-2xl border p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Technician Workspace
            </h1>
            <p className="text-default-500 mt-1 text-sm leading-relaxed">
              Prioritize urgent low-stock items, track approval progress, and
              submit new requests with fewer steps.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/technician/new-stock-request"
              className="bg-primary text-primary-foreground inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold"
            >
              New Stock Request
            </Link>
            <Link
              href="/technician/current-stock-request"
              className="bg-default-100 text-foreground inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold"
            >
              View My Requests
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
          <p className="text-default-500 flex items-center gap-1 text-xs font-semibold uppercase">
            <MdChecklist size={14} /> My Total Requests
          </p>
          <p className="text-foreground mt-2 text-2xl font-bold">
            {totalRequests}
          </p>
          <p className="text-default-500 mt-1 text-xs">
            All submitted requests
          </p>
        </div>

        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
          <p className="text-default-500 flex items-center gap-1 text-xs font-semibold uppercase">
            <MdPendingActions size={14} /> Pending
          </p>
          <p className="text-warning mt-2 text-2xl font-bold">
            {pendingRequests}
          </p>
          <p className="text-default-500 mt-1 text-xs">
            Waiting admin confirmation
          </p>
        </div>

        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
          <p className="text-default-500 flex items-center gap-1 text-xs font-semibold uppercase">
            <MdTaskAlt size={14} /> Approved
          </p>
          <p className="text-success mt-2 text-2xl font-bold">
            {approvedRequests}
          </p>
          <p className="text-default-500 mt-1 text-xs">
            Accepted and confirmed
          </p>
        </div>

        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
          <p className="text-default-500 flex items-center gap-1 text-xs font-semibold uppercase">
            <MdInfoOutline size={14} /> Rejected
          </p>
          <p className="text-danger mt-2 text-2xl font-bold">
            {rejectedRequests}
          </p>
          <p className="text-default-500 mt-1 text-xs">
            Need revision or follow-up
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5 xl:col-span-2">
          <p className="text-foreground text-sm font-semibold">
            Low Stock Watchlist
          </p>
          <p className="text-default-500 mt-0.5 text-xs">
            Active items with stock at or below {STOCK_THIN_THRESHOLD}.
          </p>

          <div className="mt-4 space-y-2">
            {lowStockWatchlist.length > 0 ? (
              lowStockWatchlist.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-default-100 flex items-center justify-between rounded-xl px-3 py-2"
                >
                  <div className="flex min-w-0 items-start gap-2">
                    <div className="bg-content1 text-default-600 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-semibold">
                        {item.name}
                      </p>
                      <p className="text-default-500 text-xs">{item.itemNo}</p>
                    </div>
                  </div>
                  <p className="text-warning ml-4 text-sm font-semibold whitespace-nowrap">
                    {item.stock} {item.unit}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-default-100 rounded-xl px-3 py-2">
                <p className="text-default-500 text-sm">
                  No low-stock items detected right now.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
          <p className="text-foreground text-sm font-semibold">
            Request Health
          </p>
          <p className="text-default-500 mt-0.5 text-xs">
            Track completion and follow-up load.
          </p>

          <div className="border-default-200 mt-4 rounded-xl border p-3">
            <p className="text-default-500 text-xs">Approval Completion</p>
            <p className="text-foreground mt-1 text-xl font-bold">
              {completionRate}%
            </p>
            <div className="bg-default-100 mt-2 h-2 w-full rounded-full">
              <div
                className="bg-success h-2 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <div className="border-default-200 mt-3 rounded-xl border p-3">
            <p className="text-default-500 text-xs">Needs Follow-up</p>
            <p className="text-foreground mt-1 flex items-center gap-1 text-xl font-bold">
              <MdWarningAmber size={18} /> {needsFollowUp}
            </p>
            <p className="text-default-500 mt-1 text-xs">
              Pending + rejected requests requiring action.
            </p>
          </div>

          <Link
            href="/technician/current-stock-request"
            className="bg-default-100 text-foreground mt-3 inline-flex h-10 w-full items-center justify-between rounded-xl px-3 text-sm font-semibold"
          >
            Open request list <MdArrowOutward size={16} />
          </Link>
        </div>
      </section>

      <section className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
        <p className="text-foreground text-sm font-semibold">Quick Actions</p>
        <p className="text-default-500 mt-0.5 text-xs">
          Most used actions for daily workflow.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link
            href="/technician/new-stock-request"
            className="bg-primary text-primary-foreground inline-flex h-11 items-center justify-between rounded-xl px-4 text-sm font-semibold"
          >
            New Stock Request <MdArrowOutward size={16} />
          </Link>
          <Link
            href="/technician/current-stock-request"
            className="bg-default-100 text-foreground inline-flex h-11 items-center justify-between rounded-xl px-4 text-sm font-semibold"
          >
            View My Requests <MdArrowOutward size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
