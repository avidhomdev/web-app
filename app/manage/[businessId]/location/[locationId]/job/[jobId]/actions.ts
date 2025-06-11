"use server";

import { formStateResponse } from "@/constants/initial-form-state";
import { DOCUSIGN_TEXT_TABS } from "@/enums/docusign-text-tabs";
import { ServerActionWithState } from "@/types/server-actions";
import { Database, Tables } from "@/types/supabase";
import { createBusinessDocusignEnvelopeFromTemplate } from "@/utils/docusign";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type UpdateJobStatusParams = Pick<
  Tables<"business_location_jobs">,
  "id" | "job_status"
>;
export async function UpdateJobStatus({
  id,
  job_status,
}: UpdateJobStatusParams) {
  const supabase = await createSupabaseServerClient();
  return supabase
    .from("business_location_jobs")
    .update({
      job_status,
    })
    .eq("id", id)
    .select("business_id,business_location_id")
    .single()
    .then(({ data, error }) => {
      if (error) throw error;

      revalidatePath(
        `/manage/${data.business_id}/location/${data.business_location_id}/job/${id}`,
      );
    });
}

export async function CreateJobMessage<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const { data, error } = await supabase
    .from("business_location_job_messages")
    .insert({
      author_id: fields.author_id as string,
      business_id: fields.business_id as string,
      location_id: Number(fields.location_id) as number,
      job_id: Number(fields.job_id) as number,
      message: fields.message as string,
    })
    .select("id")
    .single();

  if (error) {
    return formStateResponse({ ...state, error: error.message });
  }

  return formStateResponse({ ...state, success: true, data });
}

export async function UpdateJobCustomer<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const updates = {
    full_name: fields.full_name as string,
    email: fields.email as string,
    phone: fields.phone as string,
  };

  const { error } = await supabase
    .from("business_location_jobs")
    .update(updates)
    .eq("id", Number(fields.job_id));

  if (error) return formStateResponse({ ...state, error: error.message });

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(updates),
    message: `Updated customer information`,
    record_id: fields.job_id as string,
    record_table_name: "business_location_jobs",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  revalidatePath(
    `/manage/${fields.business_id}/location/${fields.location_id}/job/${fields.job_id}`,
  );

  return formStateResponse({ ...state, success: true, dismiss: true });
}

export async function UpdateJobAdditionalInformation<T>(
  ...args: ServerActionWithState<T>
) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const updates = {
    down_payment_collected: Number(fields.down_payment_collected),
    payment_type:
      fields.payment_type as Database["public"]["Enums"]["job_payment_types"],
    hoa_approval_required: fields.hoa_approval_required === "yes",
    hoa_contact_name: fields.hoa_contact_name as string,
    hoa_contact_phone: fields.hoa_contact_phone as string,
    hoa_contact_email: fields.hoa_contact_email as string,
    has_water_rebate: fields.has_water_rebate === "yes",
    lead_type: fields.lead_type as string,
    water_rebate_company: fields.water_rebate_company as string,
  };

  const { error } = await supabase
    .from("business_location_jobs")
    .update(updates)
    .eq("id", Number(fields.job_id));

  if (error) return formStateResponse({ ...state, error: error.message });

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(updates),
    message: `Updated additional information`,
    record_id: fields.job_id as string,
    record_table_name: "business_location_jobs",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  revalidatePath(
    `/manage/${fields.business_id}/location/${fields.location_id}/job/${fields.job_id}`,
  );

  return formStateResponse({ ...state, success: true, dismiss: true });
}

export async function UpdateJobEstimatedTimeline<T>(
  ...args: ServerActionWithState<T>
) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const updates = {
    estimated_start_date: fields.estimated_start_date as string,
    estimated_end_date: fields.estimated_end_date as string,
  };

  const { error } = await supabase
    .from("business_location_jobs")
    .update(updates)
    .eq("id", Number(fields.job_id));

  if (error) return formStateResponse({ ...state, error: error.message });

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(updates),
    message: `Updated estimated timelne`,
    record_id: fields.job_id as string,
    record_table_name: "business_location_jobs",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  revalidatePath(
    `/manage/${fields.business_id}/location/${fields.location_id}/job/${fields.job_id}`,
  );

  return formStateResponse({ ...state, success: true, dismiss: true });
}

export async function AddJobProfile<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const insert = {
    business_id: fields.business_id as string,
    location_id: Number(fields.location_id) as number,
    profile_id: fields.profile_id as string,
    job_id: Number(fields.job_id) as number,
    role: fields.role as Database["public"]["Enums"]["job_roles"],
  };

  const { error } = await supabase
    .from("business_location_job_profiles")
    .insert(insert);

  if (error) return formStateResponse({ ...state, error: error.message });

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(insert),
    message: `Added employee`,
    record_id: fields.job_id as string,
    record_table_name: "business_location_jobs",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  return formStateResponse({ ...state, success: true, dismiss: true });
}

export async function UpdateJobProfile<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const update = {
    profile_id: fields.profile_id as string,
    role: fields.role as Database["public"]["Enums"]["job_roles"],
  };

  const { error } = await supabase
    .from("business_location_job_profiles")
    .update(update)
    .eq("id", Number(fields.id));

  if (error) return formStateResponse({ ...state, error: error.message });

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(update),
    message: `Updated employee`,
    record_id: fields.job_id as string,
    record_table_name: "business_location_jobs",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  return formStateResponse({ ...state, success: true, dismiss: true });
}

export async function UpdateJobLocation<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const updates = {
    address: fields.address as string,
    city: fields.city as string,
    state: fields.state as string,
    postal_code: fields.postal_code as string,
  };

  const { error } = await supabase
    .from("business_location_jobs")
    .update(updates)
    .eq("id", Number(fields.job_id));

  if (error) return formStateResponse({ ...state, error: error.message });

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(updates),
    message: `Updated job location`,
    record_id: fields.job_id as string,
    record_table_name: "business_location_jobs",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  return formStateResponse({ ...state, success: true, dismiss: true });
}

export async function DeleteJobMessage(message_id: number) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("business_location_job_messages")
    .delete()
    .eq("id", message_id);

  if (error) throw error;

  return;
}

export async function AddJobMedia<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const insert = {
    business_id: fields.business_id as string,
    location_id: Number(fields.location_id),
    job_id: Number(fields.job_id),
    name: fields.name as string,
    path: fields.path as string,
  };

  const { data, error } = await supabase
    .from("business_location_job_media")
    .insert(insert)
    .select("id")
    .single();

  if (error) return formStateResponse({ ...state, error: error.message });
  if (!data) return formStateResponse({ ...state, error: "No record." });

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(insert),
    message: `Added new media`,
    record_id: fields.job_id as string,
    record_table_name: "business_location_jobs",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  return formStateResponse({ ...state, success: true, dismiss: true });
}

export async function UpdateJobMedia<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const updates = {
    name: fields.name as string,
    path: fields.path as string,
  };

  const { error } = await supabase
    .from("business_location_job_media")
    .update(updates)
    .eq("id", Number(fields.id));

  if (error) return formStateResponse({ ...state, error: error.message });

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(updates),
    message: `Updated media`,
    record_id: fields.job_id as string,
    record_table_name: "business_location_jobs",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  return formStateResponse({ ...state, success: true, dismiss: true });
}

export async function DeleteJobProfile(id: number) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("business_location_job_profiles")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return;
}

export async function DeleteJobMedia(id: number) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("business_location_job_media")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return;
}

export async function DeleteJobProduct(id: number) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("business_location_job_products")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return;
}

export async function DeleteJobProducts(ids: number[]) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("business_location_job_products")
    .delete()
    .in("id", ids);

  if (error) throw error;

  return;
}

export async function UpdateJobProducts<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);
  const startingJobIds = (fields.job_product_ids as string)
    .split(",")
    .map((string) => Number(string));

  const productsDictionary = Object.entries(fields).reduce<{
    [key: string]: {
      [key: string]: unknown;
    };
  }>((dictionary, [key, value]) => {
    if (!key.includes("product__")) return dictionary;
    const [_, tempId, field] = key.split("__");

    dictionary[tempId] = dictionary[tempId] ?? {};
    dictionary[tempId][field] = value;

    return dictionary;
  }, {});

  const updateProductIds = Object.values(productsDictionary).map((p) =>
    Number(p.id),
  );
  const deleteJobProductIds = startingJobIds.filter(
    (startingJobId) => !updateProductIds.includes(Number(startingJobId)),
  );

  const productsUpsert = Object.values(productsDictionary).flatMap((product) =>
    product.product_id
      ? {
          ...product,
          business_id: fields.business_id as string,
          location_id: Number(fields.location_id),
          job_id: Number(fields.job_id),
          product_id: Number(product.product_id),
        }
      : [],
  );

  await DeleteJobProducts(deleteJobProductIds);

  const { error: upsertJobProductsError } = await supabase
    .from("business_location_job_products")
    .upsert(productsUpsert);

  if (upsertJobProductsError) {
    return formStateResponse({
      ...state,
      error: upsertJobProductsError.message,
    });
  }

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(productsUpsert),
    message: `Updated job products`,
    record_id: fields.job_id as string,
    record_table_name: "business_location_jobs",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  const commissionUpdates = { commission: Number(fields.commission) };

  const { error: updateJobCommissionError } = await supabase
    .from("business_location_jobs")
    .update(commissionUpdates)
    .eq("id", Number(fields.job_id));

  if (updateJobCommissionError) {
    return formStateResponse({
      ...state,
      error: updateJobCommissionError.message,
    });
  }

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(commissionUpdates),
    message: `Updated job commission`,
    record_id: fields.job_id as string,
    record_table_name: "business_location_jobs",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  revalidatePath(
    `/manage/${fields.business_id}/location/${fields.location_id}/job/${fields.job_id}`,
  );

  return formStateResponse({ ...state, success: true });
}

type SendJobDocusignTemplateProps = { jobId: number; templateId: string };

export async function sendJobDocusignTemplate({
  jobId,
  templateId,
}: SendJobDocusignTemplateProps) {
  const supabase = await createSupabaseServerClient();
  const { data: job } = await supabase
    .from("business_location_jobs")
    .select(
      "id, business_id, business_location_id, creator: creator_id(full_name, email), customer: customer_id(full_name, email, phone), address, city, state, postal_code",
    )
    .eq("id", Number(jobId))
    .limit(1)
    .maybeSingle();

  if (!job) return;
  if (!job.creator.email || !job.creator.full_name) {
    return redirect(
      `/manage/${job.business_id}/location/${job.business_location_id}/job/${job.id}?error=Missing creator`,
    );
  }

  const newEnvelopeFields = {
    templateId,
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

  const { envelopeId, message } =
    await createBusinessDocusignEnvelopeFromTemplate({
      businessId: job.business_id,
      data: newEnvelopeFields,
    });

  if (!envelopeId) {
    redirect(
      `/manage/${job.business_id}/location/${job.business_location_id}/job/${job.id}?error=${message}`,
    );
  }

  const { error } = await supabase
    .from("business_location_job_docusign_envelopes")
    .insert({
      business_id: job.business_id,
      location_id: job.business_location_id,
      job_id: job.id,
      envelope_id: envelopeId,
    });

  if (error) {
    redirect(
      `/manage/${job.business_id}/location/${job.business_location_id}/job/${job.id}?error=${error.message}`,
    );
  }
  revalidatePath(
    `/manage/${job.business_id}/location/${job.business_location_id}/job/${job.id}`,
  );
  return redirect(
    `/manage/${job.business_id}/location/${job.business_location_id}/job/${job.id}?success=Contract successfully sent`,
  );
}
