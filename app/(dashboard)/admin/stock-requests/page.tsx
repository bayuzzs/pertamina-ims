import { authOptions } from "@/lib/auth";
import { getPendingInventoryMovements } from "@/services/inventory-movement.service";
import type { InventoryMovement } from "@/types/inventory-movement";
import { getServerSession } from "next-auth";
import { StockRequestPagination, StockRequestTable } from "./_components";

type AdminStockRequestPageProps = {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
  }>;
};

export default async function AdminStockRequestsPage({
  searchParams,
}: AdminStockRequestPageProps) {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams?.page ?? 1);
  const limit = Number(resolvedSearchParams?.limit ?? 10);
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const currentLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  let requests: InventoryMovement[] = [];
  let total = 0;
  let totalPages = 1;

  try {
    const response = await getPendingInventoryMovements({
      accessToken: session?.accessToken,
      page: currentPage,
      limit: currentLimit,
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
          Stock Request
        </h1>
        <p className="text-default-500 mt-1 text-sm leading-relaxed">
          Review stock requests from technicians and approve pending requests.
        </p>
      </section>

      <section className="bg-content1 border-default-200 rounded-2xl border p-3 sm:p-4">
        <div className="border-default-100 mb-3 border-b px-2 pb-3 sm:mb-4 sm:px-3">
          <p className="text-foreground text-sm font-semibold">Request List</p>
          <p className="text-default-500 mt-0.5 text-xs">
            Showing key data only. Use actions to see detail or approve request.
          </p>
        </div>

        <StockRequestTable
          requests={requests}
          accessToken={session?.accessToken}
        />
        <StockRequestPagination
          page={currentPage}
          pages={totalPages}
          total={total}
          limit={currentLimit}
        />
      </section>
    </div>
  );
}
