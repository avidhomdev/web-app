import { Tables } from "@/types/supabase";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import UsersTable from "./users-table";
import UsersHeader from "./users-header";

interface ILocation extends Tables<"business_location_profiles"> {
  location: Tables<"business_locations">;
}

interface IUserProfile extends Tables<"profiles"> {
  locations: ILocation[];
}

export interface IUser extends Tables<"business_profiles"> {
  profile?: IUserProfile;
}

export default async function Page(props: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ page: number; per_page: number; role: string }>;
}) {
  const searchParams = await props.searchParams;

  const { page = 0, per_page = 10, role = "" } = searchParams;

  const params = await props.params;

  const { businessId = "" } = params;

  const supabase = await createSupabaseServerClient();
  const startRange =
    page > 1
      ? Number(page - 1) * Number(per_page)
      : Number(page) * Number(per_page);

  const endRange = page > 1 ? startRange + Number(per_page) : per_page;

  const fetchFilteredBusinessUsers = await supabase
    .from("business_profiles")
    .select(
      "*, profile: profile_id(*,locations: business_location_profiles(*, location: location_id(*)))",
      { count: "exact" },
    )
    .match({
      business_id: businessId,
      ...(role ? { role } : {}),
    })
    .range(startRange, endRange)
    .order("created_at", { ascending: false })
    .overrideTypes<IUser[], { merge: false }>();

  const fetchAllBusinessUsers = supabase
    .from("business_profiles")
    .select("*, profile: profile_id(*)")
    .eq("business_id", businessId)
    .overrideTypes<IUser[], { merge: false }>();

  const [{ data, error: fetchAllError }, { data: filteredData, error, count }] =
    await Promise.all([fetchAllBusinessUsers, fetchFilteredBusinessUsers]);

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
    <>
      <UsersHeader />
      <UsersTable
        usersCount={data?.length ?? 0}
        users={filteredData ?? []}
        paginatedTotal={count ?? 0}
        roleCounts={roleCounts}
      />
    </>
  );
}
