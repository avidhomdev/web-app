import { createSupabaseServerClient } from "@/utils/supabase/server";

import LocationsHeader from "./locations-header";
import LocationsTable from "./locations-table";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("business_locations").select("*");

  if (error) throw error;

  return (
    <div className="container relative flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <LocationsHeader />
      <LocationsTable locations={data} />
    </div>
  );
}
