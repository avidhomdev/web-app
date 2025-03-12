"use server";

import { createBusinessDocusignEnvelopeFromTemplate } from "@/utils/docusign";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJobDocusignEnvelope(formData: FormData) {
  const fields = Object.fromEntries(formData.entries());
  const {
    business_id: businessId,
    customer_address: customerAddress,
    customer_email: customerEmail,
    customer_name: customerName,
    job_id: jobId,
    location_id: locationId,
    profile_email: profileEmail,
    profile_full_name: profileFullName,
    template_id: templateId,
  } = fields;

  const supabase = await createSupabaseServerClient();

  const newEnvelopeFields = {
    templateId: templateId as string,
    templateRoles: [
      {
        email: profileEmail as string,
        name: profileFullName as string,
        roleName: "employee",
        tabs: {
          textTabs: [
            {
              tabLabel: "landlord",
              value: profileEmail as string,
            },
            {
              tabLabel: "tenants",
              value: customerName as string,
            },
            {
              tabLabel: "address",
              value: customerAddress as string,
            },
          ],
        },
      },
      {
        email: customerEmail as string,
        name: customerName as string,
        roleName: "customer",
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
