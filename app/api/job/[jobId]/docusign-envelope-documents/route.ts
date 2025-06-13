import { DocusignEnvelope, listDocusignEnvelopes } from "@/utils/docusign";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;
  const headersList = await request.headers;

  const authHeader = headersList.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid Authorization header" },
      { status: 401 },
    );
  }
  const jwt = authHeader.split(" ")[1];

  const supabase = await createSupabaseServerClient({ jwt });
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(jwt);

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 },
    );
  }

  const { data: documents, error } = await supabase
    .from("business_location_job_docusign_envelopes")
    .select("*")
    .eq("job_id", Number(jobId));

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 },
    );
  }

  if (!documents || documents.length === 0) {
    return NextResponse.json(
      { success: true, data: { documents: [] }, error: "No documents found" },
      { status: 404 },
    );
  }

  const documentEnvelopeIds = documents.map((doc) => doc.envelope_id);

  const envelopes = await listDocusignEnvelopes({
    businessId: documents[0].business_id,
    envelopeIds: documentEnvelopeIds,
  }).then((data) =>
    data.reduce<Record<string, DocusignEnvelope>>((acc, envelope) => {
      acc[envelope.envelopeId] = envelope;
      return acc;
    }, {}),
  );

  if (!envelopes || Object.keys(envelopes).length === 0) {
    return NextResponse.json(
      { success: false, error: "No envelopes found" },
      { status: 404 },
    );
  }

  const documentsWithEnvelopes = documents.map((doc) => ({
    ...doc,
    envelope: envelopes[doc.envelope_id],
  }));

  return NextResponse.json(
    { success: true, data: { documents: documentsWithEnvelopes }, error: null },
    { status: 200 },
  );
}
