import { authOptions } from "@/lib/auth";
import { getPendingInventoryMovements } from "@/services/inventory-movement.service";
import { getAllItems } from "@/services/item.service";
import { getAllUsers } from "@/services/user.service";
import { getServerSession } from "next-auth";
import AdminDashboardHero from "./_components/admin-dashboard-hero";
import AdminInsightsSection from "./_components/admin-insights-section";
import AdminKpiCards from "./_components/admin-kpi-cards";
import AdminQuickActions from "./_components/admin-quick-actions";

const STOCK_THIN_THRESHOLD = 30;

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  let totalItems = 0;
  let lowStockItems = 0;
  let outOfStockItems = 0;
  let activeItems = 0;
  let discontinuedItems = 0;
  let totalUsers = 0;
  let activeUsers = 0;
  let inactiveUsers = 0;
  let pendingRequests = 0;

  const [itemsResult, usersResult, pendingRequestsResult] =
    await Promise.allSettled([
      getAllItems({
        accessToken: session?.accessToken,
        page: 1,
        limit: 500,
      }),
      getAllUsers({
        accessToken: session?.accessToken,
      }),
      getPendingInventoryMovements({
        accessToken: session?.accessToken,
        page: 1,
        limit: 1,
      }),
    ]);

  if (itemsResult.status === "fulfilled") {
    totalItems = itemsResult.value.pagination.total;
    lowStockItems = itemsResult.value.data.filter(
      (item) => item.stock > 0 && item.stock <= STOCK_THIN_THRESHOLD,
    ).length;
    outOfStockItems = itemsResult.value.data.filter(
      (item) => item.stock <= 0,
    ).length;
    activeItems = itemsResult.value.data.filter(
      (item) => item.status === "active",
    ).length;
    discontinuedItems = itemsResult.value.data.filter(
      (item) => item.status === "discontinued",
    ).length;
  }

  if (usersResult.status === "fulfilled") {
    totalUsers = usersResult.value.length;
    activeUsers = usersResult.value.filter(
      (user) => user.status === "ACTIVE",
    ).length;
    inactiveUsers = usersResult.value.filter(
      (user) => user.status === "INACTIVE",
    ).length;
  }

  if (pendingRequestsResult.status === "fulfilled") {
    pendingRequests = pendingRequestsResult.value.pagination.total;
  }

  const stockCoverage =
    totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 0;
  const userAvailability =
    totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
  const urgentIssues = outOfStockItems + pendingRequests + inactiveUsers;

  return (
    <div className="space-y-4 sm:space-y-5">
      <AdminDashboardHero />

      <AdminKpiCards
        totalItems={totalItems}
        lowStockItems={lowStockItems}
        outOfStockItems={outOfStockItems}
        pendingRequests={pendingRequests}
        stockThinThreshold={STOCK_THIN_THRESHOLD}
      />

      <AdminInsightsSection
        activeItems={activeItems}
        discontinuedItems={discontinuedItems}
        stockCoverage={stockCoverage}
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        inactiveUsers={inactiveUsers}
        userAvailability={userAvailability}
        outOfStockItems={outOfStockItems}
        pendingRequests={pendingRequests}
        urgentIssues={urgentIssues}
      />

      <AdminQuickActions />
    </div>
  );
}
