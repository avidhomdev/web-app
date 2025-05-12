import PageHeaderWithActions from "@/components/page-header-with-actions";
import { Tables } from "@/types/supabase";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { Calendar } from "./calendar";

interface AppointmentProfile extends Tables<"business_appointment_profiles"> {
  profile: Tables<"profiles">;
}
export interface BusinessAppointment extends Tables<"business_appointments"> {
  location: Tables<"business_locations">;
  job: Tables<"business_location_jobs">;
  profiles: AppointmentProfile[];
}

export default async function Page({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: appointments } = await supabase
    .from("business_appointments")
    .select(
      `
        *,
        location: location_id(*),
        job: job_id(*),
        profiles: business_appointment_profiles(*,
          profile: profile_id(*)
        )
      `,
    )
    .match({ business_id: businessId })
    .overrideTypes<BusinessAppointment[]>();

  return (
    <div className="container relative flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <PageHeaderWithActions
        title="Schedule"
        subtitle="Manage the job schedule for your employees"
      />
      <Calendar appointments={appointments ?? []} />
    </div>
  );
}
