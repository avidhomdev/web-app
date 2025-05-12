import PageHeaderWithActions from "@/components/page-header-with-actions";
import { ILocationJob } from "@/contexts/location";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { Calendar } from "./calendar";
import { JobsList } from "./job-list";
import { Tables } from "@/types/supabase";

interface AppointmentProfile extends Tables<"business_appointment_profiles"> {
  profile: Tables<"profiles">;
}
export interface BusinessAppointment extends Tables<"business_appointments"> {
  job: Tables<"business_location_jobs">;
  profiles: AppointmentProfile[];
}

export default async function Page({
  params,
}: {
  params: Promise<{ businessId: string; locationId: string }>;
}) {
  const { businessId, locationId } = await params;
  const supabase = await createSupabaseServerClient();
  const [{ data: appointments }, { data: jobs }] = await Promise.all([
    supabase
      .from("business_appointments")
      .select(
        `
        *,
        profiles: business_appointment_profiles(*,
          profile: profile_id(*)
        ),
        job: job_id(*)f
      `,
      )
      .match({ business_id: businessId })
      .not("job_id", "is", null)
      .overrideTypes<BusinessAppointment[]>(),
    supabase
      .from("business_location_jobs")
      .select(
        `*,
        products: business_location_job_products(
          *,
          product: product_id(*)
        ),
        profiles: business_location_job_profiles(
          *,
          profile: profile_id(*)
        )
      `,
      )
      .eq("business_location_id", Number(locationId))
      .overrideTypes<ILocationJob[]>(),
  ]);

  return (
    <div className="relative grid grid-rows-2 items-start md:grid-cols-12 md:grid-rows-1">
      <JobsList jobs={jobs ?? []} />
      <div className="flex flex-col gap-4 p-4 md:sticky md:top-16 md:col-span-9 lg:gap-6 lg:p-6">
        <PageHeaderWithActions
          title="Schedule"
          subtitle="Manage the job schedule for your employees"
        />
        <Calendar appointments={appointments ?? []} />
      </div>
    </div>
  );
}
