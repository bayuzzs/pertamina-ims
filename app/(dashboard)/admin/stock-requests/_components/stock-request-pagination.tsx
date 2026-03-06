"use client";

import { Pagination } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type StockRequestPaginationProps = {
  page: number;
  pages: number;
  total: number;
  limit: number;
};

export default function StockRequestPagination({
  page,
  pages,
  total,
  limit,
}: StockRequestPaginationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (pages <= 1) {
    return null;
  }

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handleChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(nextPage));
    params.set("limit", String(limit));

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="border-default-100 mt-4 flex flex-col items-center justify-between gap-3 border-t pt-3 sm:flex-row sm:pt-4">
      <p className="text-default-500 text-xs sm:text-sm">
        Showing {startItem}-{endItem} of {total} requests
      </p>
      <Pagination
        showControls
        page={page}
        total={pages}
        onChange={handleChange}
        size="sm"
        radius="full"
      />
    </div>
  );
}
