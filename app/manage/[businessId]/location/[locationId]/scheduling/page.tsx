import PageHeaderWithActions from "@/components/page-header-with-actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import DragAndDropScheduler from "./drag-and-drop-scheduler";
import { IJob } from "@/types/job";
import dayjs from "dayjs";
import { TAppointment } from "@/types/appointments";

type TSchedulingProps = {
  params: Promise<{ locationId: string }>;
  searchParams: Promise<{ selectedDate: string }>;
};

export default async function Scheduling(props: TSchedulingProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { locationId } = params;
  const { selectedDate } = searchParams;
  const supabase = await createSupabaseServerClient();

  const { data: appointments } = await supabase
    .from("business_location_job_appointments")
    .select(
      "*, job: job_id(*),profiles: business_location_job_appointment_profiles(*,profile: profile_id(*)) ",
    )
    .eq("location_id", Number(locationId))
    .gte(
      "start_datetime",
      dayjs(selectedDate ?? undefined)
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm"),
    )
    .lte(
      "end_datetime",
      dayjs(selectedDate ?? undefined)
        .endOf("day")
        .format("YYYY-MM-DDTHH:mm"),
    )
    .overrideTypes<TAppointment[]>();

  const { data: jobs } = await supabase
    .from("business_location_jobs")
    .select("*, appointments: business_location_job_appointments(*)")
    .eq("business_location_id", Number(locationId))
    .overrideTypes<IJob[]>();

  return (
    <>
      <PageHeaderWithActions
        title="Scheduling"
        subtitle="View, edit and bulk add to the schedule"
      />
      <DragAndDropScheduler
        appointments={appointments ?? []}
        jobs={jobs ?? []}
      />
    </>
  );
}
