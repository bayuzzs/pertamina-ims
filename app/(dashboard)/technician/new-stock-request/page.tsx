import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import NewStockRequestForm from "./_components/new-stock-request-form";

export default async function NewStockRequestPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="bg-content1 border-default-200 rounded-2xl border p-5 sm:p-6">
        <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          New Stock Request
        </h1>
        <p className="text-default-500 mt-1 text-sm leading-relaxed">
          Create a new inventory stock request for technician operations.
        </p>
      </section>

      <section className="bg-content1 border-default-200 rounded-2xl border p-4 sm:p-5">
        <div className="border-default-100 mb-4 border-b pb-3">
          <p className="text-foreground text-sm font-semibold">Request Form</p>
          <p className="text-default-500 mt-0.5 text-xs">
            Fill all required fields and submit the stock movement request.
          </p>
        </div>

        <NewStockRequestForm accessToken={session?.accessToken} />
      </section>
    </div>
  );
}
