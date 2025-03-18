import { getBusinessDocusignTemplates } from "@/utils/docusign";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import AddJobDocumentDrawer from "./add-job-document-drawer";
import ErrorAlert from "@/components/error-alert";
import { Alert } from "flowbite-react";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string; jobId: string }>;
  searchParams: Promise<{ error: string; success: string }>;
}) {
  const { error, success } = await searchParams;
  const { businessId, jobId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: job } = await supabase
    .from("business_location_jobs")
    .select("*,customer: customer_id(*)")
    .eq("id", Number(jobId))
    .single();

  const templates = await getBusinessDocusignTemplates(businessId);

  return (
    <div className="grid gap-4 md:gap-6">
      {error && <ErrorAlert message={error} />}
      {success && <Alert color="success">{success}</Alert>}
      {job && (
        <div>
          <AddJobDocumentDrawer templates={templates} job={job} />
        </div>
      )}
    </div>
  );
}
