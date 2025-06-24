"use server";
import { createSupabaseServerClient } from "@/utils/supabase/server";

type UpdateBusinessProfileAvailabilityProps = {
  availability: Record<string, Record<string, boolean>>;
  businessId: string;
  profileId: string;
};

export async function UpdateBusinessProfileAvailability({
  availability,
  businessId,
  profileId,
}: UpdateBusinessProfileAvailabilityProps) {
  const supabase = await createSupabaseServerClient();

  return supabase
    .from("business_profiles")
    .update({
      availability,
    })
    .match({ business_id: businessId, profile_id: profileId });
}
