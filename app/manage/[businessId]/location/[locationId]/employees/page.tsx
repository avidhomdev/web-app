import { Tables } from "@/types/supabase";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import EmployeesHeader from "./employees-header";
import EmployeesTable from "./employees-table";
export interface IEmployee extends Tables<"business_location_profiles"> {
  profile?: Tables<"profiles">;
}

type TPageProps = {
  searchParams: Promise<{ page?: number; per_page?: number; role?: string }>;
  params: Promise<{ locationId: string }>;
};

export default async function Page(props: TPageProps) {
  const searchParams = await props.searchParams;

  const { page = 0, per_page = 10, role = "" } = searchParams;

  const params = await props.params;

  const { locationId = "" } = params;

  const supabase = await createSupabaseServerClient();
  const startRange =
    page > 1
      ? Number(page - 1) * Number(per_page)
      : Number(page) * Number(per_page);

  const endRange = page > 1 ? startRange + Number(per_page) : per_page;

  const fetchFilteredLocationEmployees = await supabase
    .from("business_location_profiles")
    .select("*, profile: profile_id(*)", { count: "exact" })
    .match({
      location_id: Number(locationId),
      ...(role ? { role } : {}),
    })
    .range(startRange, endRange)
    .order("created_at", { ascending: false })
    .overrideTypes<IEmployee[]>();

  const fetchAllLocationEmployees = supabase
    .from("business_location_profiles")
    .select("*, profile: profile_id(*)")
    .eq("location_id", Number(locationId))
    .overrideTypes<IEmployee[]>();

  const [{ data, error: fetchAllError }, { data: filteredData, error, count }] =
    await Promise.all([
      fetchAllLocationEmployees,
      fetchFilteredLocationEmployees,
    ]);

  if (error) throw error;
  if (fetchAllError) throw fetchAllError;

  const roleCounts = (data ?? []).reduce(
    (dictionary, job) => {
      dictionary[job.role] = Number(dictionary[job.role] ?? 0) + 1;

      return dictionary;
    },
    {
      admin: 0,
      manager: 0,
      base: 0,
    },
  );

  return (
    <div className="container relative flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <EmployeesHeader />
      <EmployeesTable
        employeesCount={data?.length ?? 0}
        employees={filteredData ?? []}
        paginatedTotal={count ?? 0}
        roleCounts={roleCounts}
      />
    </div>
  );
}
