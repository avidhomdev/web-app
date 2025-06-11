import { createSupabaseServerClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import JobHeader from "./job-header";
import { IJob } from "@/types/job";

type TLayout = {
  children: ReactNode;
  params: Promise<{
    jobId: string;
  }>;
};

export default async function Layout(props: TLayout) {
  const params = await props.params;

  const { jobId } = params;

  const { children } = props;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("business_location_jobs")
    .select(
      "*, documents: business_location_job_docusign_envelopes(*), payments: business_location_job_payments(*)",
    )
    .eq("id", Number(jobId))
    .limit(1)
    .maybeSingle()
    .overrideTypes<IJob, { merge: false }>();

  if (error) throw error;
  if (!data) notFound();

  return (
    <div className="relative container flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <JobHeader job={data} />
      {children}
    </div>
  );
}
