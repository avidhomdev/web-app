import { createSupabaseServerClient } from "@/utils/supabase/server";

import PageHeaderWithActions from "@/components/page-header-with-actions";
import { ILocationCustomer } from "@/types/location";
import CustomersTable from "./customers-table";

type TPageProps = {
  searchParams: Promise<{ page?: number; per_page?: number; role?: string }>;
  params: Promise<{ businessId: string }>;
};

export default async function Page(props: TPageProps) {
  const searchParams = await props.searchParams;

  const { page = 0, per_page = 10 } = searchParams;

  const params = await props.params;

  const { businessId = "" } = params;

  const supabase = await createSupabaseServerClient();
  const startRange =
    page > 1
      ? Number(page - 1) * Number(per_page)
      : Number(page) * Number(per_page);

  const endRange = page > 1 ? startRange + Number(per_page) : per_page;

  const fetchFilteredCustomers = supabase
    .from("business_location_customers")
    .select(
      `*,
      creator: creator_id(*), jobs: business_location_jobs(id),
      location: location_id(*)
      `,
      {
        count: "exact",
      },
    )
    .match({
      business_id: businessId,
    })
    .range(startRange, endRange)
    .order("created_at", { ascending: false })
    .overrideTypes<ILocationCustomer[]>();

  const fetchAllBusinessCustomers = supabase
    .from("business_location_customers")
    .select("*")
    .eq("business_id", businessId);

  const [{ data, error: fetchAllError }, { data: filteredData, error, count }] =
    await Promise.all([fetchAllBusinessCustomers, fetchFilteredCustomers]);

  if (error) throw error;
  if (fetchAllError) throw fetchAllError;

  return (
    <div className="container relative flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <PageHeaderWithActions
        title="Customers"
        subtitle="Customer management for your location."
      />
      <CustomersTable
        customersCount={data?.length ?? 0}
        customers={filteredData ?? []}
        paginatedTotal={count ?? 0}
      />
    </div>
  );
}
