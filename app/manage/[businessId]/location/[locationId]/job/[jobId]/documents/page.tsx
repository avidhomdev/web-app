import ErrorAlert from "@/components/error-alert";
import { listDocusignEnvelopes } from "@/utils/docusign";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { Alert } from "flowbite-react";
import { notFound } from "next/navigation";
import DocumentsTable from "./documents-table";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string; jobId: string }>;
  searchParams: Promise<{ error: string; success: string }>;
}) {
  const { error, success } = await searchParams;
  const { jobId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: job } = await supabase
    .from("business_location_jobs")
    .select(
      "*,customer: customer_id(*), documents: business_location_job_docusign_envelopes(*)",
    )
    .eq("id", Number(jobId))
    .single();
  if (!job) return notFound();
  const documents = job?.documents ?? [];
  const documentEnvelopeIds = documents.map((document) => document.envelope_id);
  const envelopes = await listDocusignEnvelopes({
    businessId: job.business_id,
    envelopeIds: documentEnvelopeIds,
  });

  return (
    <div className="grid gap-4 md:gap-6">
      {error && <ErrorAlert message={error} />}
      {success && <Alert color="success">{success}</Alert>}
      <DocumentsTable documents={job?.documents || []} envelopes={envelopes} />
    </div>
  );
}
