import { Tables } from "@/types/supabase";
import { createSupabaseServerClient } from "@/utils/supabase/server";

import { Card, Timeline } from "flowbite-react";
import { notFound } from "next/navigation";
import JobHistoryTimelineItem from "./job-history-timeline-item";

type TLog = Tables<"business_logs"> & {
  profile: Tables<"profiles">;
};

export default async function Page(props: {
  params: Promise<{ jobId: string }>;
}) {
  const params = await props.params;

  const { jobId } = params;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("business_logs")
    .select("*, profile: profile_id(*)")
    .match({ record_table_name: "business_location_jobs", record_id: jobId })
    .order("created_at", { ascending: false })
    .overrideTypes<TLog[]>();

  if (error) throw error;
  if (!data) notFound();

  return (
    <Card>
      <Timeline>
        {data.map((log) => (
          <JobHistoryTimelineItem key={log.id} log={log} />
        ))}
      </Timeline>
    </Card>
  );
}
