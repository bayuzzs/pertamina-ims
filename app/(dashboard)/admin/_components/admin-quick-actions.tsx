import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";

export default function AdminQuickActions() {
  return (
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
  );
}
