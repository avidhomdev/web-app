import { dynamicDocusignFetch } from "@/utils/docusign";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
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

  const { data: document, error } = await supabase
    .from("business_location_job_docusign_envelopes")
    .select("*")
    .eq("id", Number(documentId))
    .limit(1)
    .maybeSingle();

  if (error || !document) {
    return NextResponse.json(
      { success: false, error: "Document not found" },
      { status: 404 },
    );
  }

  const pdfBlobResponse = await dynamicDocusignFetch({
    businessId: document.business_id,
    uri: `/envelopes/${document.envelope_id}/documents/combined`,
  });

  return NextResponse.json(
    { success: true, data: pdfBlobResponse },
    { status: 200 },
  );
}
