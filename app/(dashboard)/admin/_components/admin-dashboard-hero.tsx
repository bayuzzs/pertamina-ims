import Link from "next/link";

export default function AdminDashboardHero() {
  return (
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
  );
}
