import { authOptions } from "@/lib/auth";
import { getAllItems } from "@/services/item.service";
import type { Item } from "@/types/item";
import { getServerSession } from "next-auth";
import AddItemModal from "./_components/add-item-modal";
import InventoryPagination from "./_components/inventory-pagination";
import InventoryTable from "./_components/inventory-table";

type InventoryPageProps = {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
  }>;
};

export default async function AdminInventoryPage({
  searchParams,
}: InventoryPageProps) {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams?.page ?? 1);
  const limit = Number(resolvedSearchParams?.limit ?? 10);
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const currentLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  let items: Item[] = [];
  let total = 0;
  let totalPages = 1;

  try {
    const response = await getAllItems({
      accessToken: session?.accessToken,
      page: currentPage,
      limit: currentLimit,
    });

    items = response.data;
    total = response.pagination.total;
    totalPages = response.pagination.pages;
  } catch {
    items = [];
    total = 0;
    totalPages = 1;
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="bg-content1 border-default-200 rounded-2xl border p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Inventory Master Data
            </h1>
            <p className="text-default-500 mt-1 text-sm leading-relaxed">
              Manage and track all aviation fuel terminal inventory items, stock
              levels, and item details in one centralized dashboard.
            </p>
          </div>
          <AddItemModal accessToken={session?.accessToken} />
        </div>
      </section>

      <section className="bg-content1 border-default-200 rounded-2xl border p-3 sm:p-4">
        <div className="border-default-100 mb-3 border-b px-2 pb-3 sm:mb-4 sm:px-3">
          <p className="text-foreground text-sm font-semibold">
            Inventory List
          </p>
          <p className="text-default-500 mt-0.5 text-xs">
            Showing all inventory items based on the latest data.
          </p>
        </div>
        <InventoryTable items={items} />
        <InventoryPagination
          page={currentPage}
          pages={totalPages}
          total={total}
          limit={currentLimit}
        />
      </section>
    </div>
  );
}
