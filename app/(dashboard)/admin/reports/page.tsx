import { authOptions } from "@/lib/auth";
import { getInventoryMovements } from "@/services/inventory-movement.service";
import type { InventoryMovement } from "@/types/inventory-movement";
import { getServerSession } from "next-auth";
import { ReportFilter, ReportPagination, ReportTable } from "./_components";

type AdminReportsPageProps = {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
    startdate?: string;
    enddate?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    itemName?: string;
  }>;
};

export default async function AdminReportsPage({
  searchParams,
}: AdminReportsPageProps) {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams?.page ?? 1);
  const limit = Number(resolvedSearchParams?.limit ?? 10);
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const currentLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  const startDate =
    resolvedSearchParams?.startdate ?? resolvedSearchParams?.startDate ?? "";
  const endDate =
    resolvedSearchParams?.enddate ?? resolvedSearchParams?.endDate ?? "";
  const status = resolvedSearchParams?.status ?? "approved";
  const itemName = resolvedSearchParams?.itemName ?? "";

  let requests: InventoryMovement[] = [];
  let total = 0;
  let totalPages = 1;

  try {
    const response = await getInventoryMovements({
      accessToken: session?.accessToken,
      page: currentPage,
      limit: currentLimit,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status: status === "all" ? undefined : status,
      itemName: itemName || undefined,
    });

    requests = response.data;
    total = response.pagination.total;
    totalPages = response.pagination.pages;
  } catch {
    requests = [];
    total = 0;
    totalPages = 1;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="bg-content1 border-default-200 rounded-2xl border p-5 sm:p-6">
        <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          Reports
        </h1>
        <p className="text-default-500 mt-1 text-sm leading-relaxed">
          Monitor inventory movements and filter data by status and date range.
        </p>
      </section>

      <section className="bg-content1 border-default-200 rounded-2xl border p-3 sm:p-4">
        <ReportFilter
          startDate={startDate}
          endDate={endDate}
          status={status}
          itemName={itemName}
        />
        <ReportTable requests={requests} />
        <ReportPagination
          page={currentPage}
          pages={totalPages}
          total={total}
          limit={currentLimit}
        />
      </section>
    </div>
  );
}
