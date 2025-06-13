"use server";

import {
  createBusinessDocusignEnvelopeFromTemplate,
  dynamicDocusignFetch,
} from "@/utils/docusign";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

enum DOCUSIGN_TEXT_TABS {
  CUSTOMER_NAME = "CUSTOMER_NAME",
  CUSTOMER_PHONE = "CUSTOMER_PHONE",
  CUSTOMER_EMAIL = "CUSTOMER_EMAIL",
  JOB_FULL_ADDRESS = "JOB_FULL_ADDRESS",
  JOB_ADDRESS = "JOB_ADDRESS",
  JOB_CITY = "JOB_CITY",
  JOB_STATE = "JOB_STATE",
  JOB_POSTAL_CODE = "JOB_POSTAL_CODE",
  CREATOR_NAME = "CREATOR_NAME",
  CREATOR_EMAIL = "CREATOR_EMAIL",
}

export async function createJobDocusignEnvelope(formData: FormData) {
  const {
    business_id: businessId,
    customer_email: customerEmail,
    customer_name: customerName,
    customer_phone: customerPhone,
    job_id: jobId,
    job_full_address: jobFullAddress,
    job_address: jobAddress,
    job_city: jobCity,
    job_state: jobState,
    job_postal_code: jobPostalCode,
    location_id: locationId,
    profile_email: profileEmail,
    profile_full_name: profileFullName,
    template_id: templateId,
  } = Object.fromEntries(formData.entries());

  const supabase = await createSupabaseServerClient();

  const newEnvelopeFields = {
    templateId: templateId as string,
    templateRoles: [
      {
        email: profileEmail as string,
        name: profileFullName as string,
        roleName: "CREATOR",
        tabs: {
          textTabs: [
            {
              tabLabel: DOCUSIGN_TEXT_TABS.CUSTOMER_NAME,
              value: customerName as string,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.CUSTOMER_EMAIL,
              value: customerEmail as string,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.CUSTOMER_PHONE,
              value: customerPhone as string,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.JOB_FULL_ADDRESS,
              value: jobFullAddress as string,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.JOB_ADDRESS,
              value: jobAddress as string,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.JOB_CITY,
              value: jobCity as string,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.JOB_STATE,
              value: jobState as string,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.JOB_POSTAL_CODE,
              value: jobPostalCode as string,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.CREATOR_NAME,
              value: profileFullName as string,
            },
            {
              tabLabel: DOCUSIGN_TEXT_TABS.CREATOR_EMAIL,
              value: profileEmail as string,
            },
          ],
        },
      },
      {
        email: customerEmail as string,
        name: customerName as string,
        roleName: "CUSTOMER",
      },
    ],
    status: "sent",
  };

  const { envelopeId, message } =
    await createBusinessDocusignEnvelopeFromTemplate({
      businessId: businessId as string,
      data: newEnvelopeFields,
    });

  if (!envelopeId) {
    redirect(
      `/manage/${businessId}/location/${locationId}/job/${jobId}/documents?error=${message}`,
    );
  }

  const { error } = await supabase
    .from("business_location_job_docusign_envelopes")
    .insert({
      business_id: businessId as string,
      location_id: Number(locationId),
      job_id: Number(jobId),
      envelope_id: envelopeId as string,
    });

  if (error) {
    redirect(
      `/manage/${businessId}/location/${locationId}/job/${jobId}/documents?error=${error.message}`,
    );
  }
  revalidatePath(
    `/manage/${businessId}/location/${locationId}/job/${jobId}/documents`,
  );
  return redirect(
    `/manage/${businessId}/location/${locationId}/job/${jobId}/documents?success=Document successfully added`,
  );
}

export async function getCombinedDocumentBlob(businessId: string, uri: string) {
  if (!uri || !businessId) return;

  return dynamicDocusignFetch({
    businessId,
    uri,
  }).then((res) => res.blob());
}
