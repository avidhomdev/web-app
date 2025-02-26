import { IJob, IJobMessage } from "@/types/job";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import JobAdditionalInformationCard from "./job-additional-information-card";
import JobEmployeesCard from "./job-employees-card";
import JobEstimatedTimelineCard from "./job-estimated-timeline-card";
import JobLineitemsCard from "./job-lineitems-card";
import JobLocationCard from "./job-location-card";
import JobMediaCard from "./job-media-card";
import JobMessagesCard from "./job-messages-card";
import JobCustomerCard from "./job-customer-card";

type TProps = {
  params: Promise<{ jobId: string }>;
};

export default async function Page(props: TProps) {
  const params = await props.params;

  const { jobId = "" } = params;

  const supabase = await createSupabaseServerClient();

  const fetchJob = supabase
    .from("business_location_jobs")
    .select(
      "*,  media: business_location_job_media(*), profiles: business_location_job_profiles(*, profile: profile_id(*)), products: business_location_job_products(*, product: business_products(*))",
    )
    .eq("id", Number(jobId))
    .limit(1)
    .single()
    .overrideTypes<IJob>();

  const fetchMessages = supabase
    .from("business_location_job_messages")
    .select("*, author: author_id(*)")
    .eq("job_id", Number(jobId))
    .order("created_at", { ascending: false })
    .limit(50)
    .overrideTypes<IJobMessage[]>();

  const [{ data, error }, { data: messages }] = await Promise.all([
    fetchJob,
    fetchMessages,
  ]);

  if (error) throw error;
  if (!data) notFound();

  const job: IJob = data;

  return (
    <div className="grid gap-4 xl:grid-cols-3 xl:gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:col-span-2 xl:gap-6">
        <JobLocationCard job={job} />
        <div className="grid gap-4 xl:gap-6">
          <JobAdditionalInformationCard job={job} />
          <JobEstimatedTimelineCard job={job} />
        </div>
        <div className="md:col-span-2">
          <JobLineitemsCard job={job} />
        </div>
        <div className="md:col-span-2">
          <JobMediaCard media={job.media ?? []} />
        </div>
      </div>
      <div className="flex flex-col gap-4 xl:gap-6">
        <JobCustomerCard job={job} />
        <JobEmployeesCard job={job} />
        <JobMessagesCard messages={messages} />
      </div>
    </div>
  );
}
