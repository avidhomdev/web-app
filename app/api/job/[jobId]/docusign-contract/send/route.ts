import { DOCUSIGN_TEXT_TABS } from "@/enums/docusign-text-tabs";
import { BusinessIntegration } from "@/types/business-integrations";
import { sendEnvelopeTemplateWithIntegrationData } from "@/utils/docusign";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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

  const supabaseAdmin = await createSupabaseServerClient({ admin: true });

  const { data: job, error } = await supabaseAdmin
    .from("business_location_jobs")
    .select(
      "id, business_id, business_location_id, creator: creator_id(full_name, email), customer: customer_id(full_name, email, phone), address, city, state, postal_code",
    )
    .eq("id", Number(jobId))
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 },
    );
  }

  if (!job) {
    return NextResponse.json(
      { success: false, error: "Missing job" },
      { status: 401 },
    );
  }

  const { data: businessIntegration, error: businessIntegrationError } =
    await supabaseAdmin
      .from("business_integrations")
      .select("*")
      .match({ business_id: job?.business_id, resource: "docusign" })
      .limit(1)
      .maybeSingle()
      .overrideTypes<BusinessIntegration>();

  if (businessIntegrationError) {
    return NextResponse.json(
      { success: false, error: businessIntegrationError.message },
      { status: 401 },
    );
  }

  if (!businessIntegration) {
    return NextResponse.json(
      { success: false, error: "Missing integration" },
      { status: 401 },
    );
  }

  if (!businessIntegration.metadata.jobContractTemplateId) {
    return NextResponse.json(
      { success: false, error: "Missing docusign template" },
      { status: 401 },
    );
  }

  if (!job.creator.full_name || !job.creator.email) {
    return NextResponse.json(
      { success: false, error: "Missing creator contact information" },
      { status: 401 },
    );
  }
  const newEnvelopeFields = {
    templateId: businessIntegration.metadata.jobContractTemplateId,
    templateRoles: [
      {
        email: job.creator.email,
        name: job.creator.full_name,
        roleName: "CREATOR",
        tabs: {
          textTabs: [
            {
              tabLabel: DOCUSIGN_TEXT_TABS.CUSTOMER_NAME,
              value: job.customer.full_name,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.CUSTOMER_EMAIL,
              value: job.customer.email,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.CUSTOMER_PHONE,
              value: job.customer.phone,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.JOB_FULL_ADDRESS,
              value: `${job.address || ""}${job.city ? `, ${job.city}` : ``}${job.state ? `, ${job.state}` : ``}${job.postal_code ? `, ${job.postal_code}` : ``}`,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.JOB_ADDRESS,
              value: job.address,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.JOB_CITY,
              value: job.city,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.JOB_STATE,
              value: job.state,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.JOB_POSTAL_CODE,
              value: job.postal_code,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.CREATOR_NAME,
              value: job.creator.full_name,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.CREATOR_EMAIL,
              value: job.creator.email,
            },
          ],
        },
      },
      {
        email: job.customer.email,
        name: job.customer.full_name,
        roleName: "CUSTOMER",
      },
    ],
    status: "sent",
  };

  const { envelopeId, message } = await sendEnvelopeTemplateWithIntegrationData(
    {
      integration: businessIntegration,
      data: newEnvelopeFields,
    },
  );

  if (!envelopeId) {
    return NextResponse.json(
      { success: false, error: message },
      { status: 401 },
    );
  }

  const { error: businessLocationJobDocusignEnvelopeError } =
    await supabaseAdmin
      .from("business_location_job_docusign_envelopes")
      .insert({
        business_id: job.business_id,
        location_id: job.business_location_id,
        job_id: job.id,
        envelope_id: envelopeId,
      });

  if (businessLocationJobDocusignEnvelopeError) {
    return NextResponse.json(
      {
        success: false,
        error: businessLocationJobDocusignEnvelopeError.message,
      },
      { status: 401 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: { ...job, metadata: businessIntegration.metadata },
      error: false,
    },
    { status: 200 },
  );
}
