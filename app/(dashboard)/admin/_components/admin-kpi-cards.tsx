import {
  MdErrorOutline,
  MdInventory2,
  MdPendingActions,
  MdWarningAmber,
} from "react-icons/md";

type AdminKpiCardsProps = {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  pendingRequests: number;
  stockThinThreshold: number;
};

export default function AdminKpiCards({
  totalItems,
  lowStockItems,
  outOfStockItems,
  pendingRequests,
  stockThinThreshold,
}: AdminKpiCardsProps) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
        <p className="text-default-500 flex items-center gap-1 text-xs font-semibold uppercase">
          <MdInventory2 size={14} /> Total Items
        </p>
        <p className="text-foreground mt-2 text-2xl font-bold">{totalItems}</p>
        <p className="text-default-500 mt-1 text-xs">
          Registered inventory items
        </p>
      </div>

      <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
        <p className="text-default-500 flex items-center gap-1 text-xs font-semibold uppercase">
          <MdWarningAmber size={14} /> Low Stock
        </p>
        <p className="text-warning mt-2 text-2xl font-bold">{lowStockItems}</p>
        <p className="text-default-500 mt-1 text-xs">
          Stock ≤ {stockThinThreshold} and still available
        </p>
      </div>

      <div className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
        <p className="text-default-500 flex items-center gap-1 text-xs font-semibold uppercase">
          <MdErrorOutline size={14} /> Out of Stock
        </p>
        <p className="text-danger mt-2 text-2xl font-bold">{outOfStockItems}</p>
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
  );
}
