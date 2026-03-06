import { authOptions } from "@/lib/auth";
import { getMyInventoryMovements } from "@/services/inventory-movement.service";
import type { InventoryMovement } from "@/types/inventory-movement";
import { getServerSession } from "next-auth";
import Link from "next/link";
import MyStockRequestPagination from "./_components/my-stock-request-pagination";
import MyStockRequestTable from "./_components/my-stock-request-table";

type CurrentStockRequestPageProps = {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
  }>;
};

export default async function CurrentStockRequestPage({
  searchParams,
}: CurrentStockRequestPageProps) {
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
    const response = await getMyInventoryMovements({
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              My Stock Request
            </h1>
            <p className="text-default-500 mt-1 text-sm leading-relaxed">
              Track your submitted stock requests and their approval status.
            </p>
          </div>
          <Link
            href="/technician/new-stock-request"
            className="bg-primary text-primary-foreground inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold"
          >
            Create New Request
          </Link>
        </div>
      </section>

      <section className="bg-content1 border-default-200 rounded-2xl border p-3 sm:p-4">
        <div className="border-default-100 mb-3 border-b px-2 pb-3 sm:mb-4 sm:px-3">
          <p className="text-foreground text-sm font-semibold">Request List</p>
          <p className="text-default-500 mt-0.5 text-xs">
            Showing concise request information. Use See Details for full data.
          </p>
        </div>

        <MyStockRequestTable requests={requests} />
        <MyStockRequestPagination
          page={currentPage}
          pages={totalPages}
          total={total}
          limit={currentLimit}
        />
      </section>
    </div>
  );
}
