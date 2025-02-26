import { ILocation, LocationContextProvider } from "@/contexts/location";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function Layout(
  props: PropsWithChildren<{ params: Promise<{ locationId: string }> }>,
) {
  const params = await props.params;

  const { locationId } = params;

  const { children } = props;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("business_locations")
    .select(
      "*, profiles: business_location_profiles!id(*, profile: profile_id(id, full_name))",
    )
    .eq("id", Number(locationId))
    .limit(1)
    .maybeSingle()
    .overrideTypes<ILocation>();

  if (error) throw error;
  if (!data) notFound();

  return (
    <LocationContextProvider location={data}>
      {children}
    </LocationContextProvider>
  );
}
