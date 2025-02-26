"use server";

import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function AddLocationCustomer<T>(
  ...args: ServerActionWithState<T>
) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const insert = {
    address: fields.address as string,
    business_id: fields.business_id as string,
    city: fields.city as string,
    creator_id: fields.profile_id as string,
    disposition_status: fields.disposition_status as string,
    email: fields.email as string,
    full_name: fields.full_name as string,
    lead_source: fields.lead_source as string,
    location_id: Number(fields.location_id),
    notes: fields.notes as string,
    phone: fields.phone as string,
    postal_code: fields.postal_code as string,
    state: fields.state as string,
  };

  const { error } = await supabase
    .from("business_location_customers")
    .insert(insert);

  if (error) return formStateResponse({ ...state, error: error.message });

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(insert),
    message: `Add new customer`,
    record_id: fields.job_id as string,
    record_table_name: "business_location_customers",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  revalidatePath(
    `/manage/${fields.business_id}/location/${fields.location_id}/customers`,
    "page",
  );

  return formStateResponse({ ...state, success: true, dismiss: true });
}

export async function UpdateLocationCustomer<T>(
  ...args: ServerActionWithState<T>
) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const updates = {
    address: fields.address as string,
    city: fields.city as string,
    disposition_status: fields.disposition_status as string,
    email: fields.email as string,
    full_name: fields.full_name as string,
    lead_source: fields.lead_source as string,
    notes: fields.notes as string,
    phone: fields.phone as string,
    postal_code: fields.postal_code as string,
    state: fields.state as string,
  };

  const { error } = await supabase
    .from("business_location_customers")
    .update(updates)
    .eq("id", Number(fields.id));

  if (error) return formStateResponse({ ...state, error: error.message });

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(updates),
    message: `Updated customer`,
    record_id: fields.job_id as string,
    record_table_name: "business_location_customers",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  revalidatePath(
    `/manage/${fields.business_id}/location/${fields.location_id}/customers`,
    "page",
  );

  return formStateResponse({ ...state, success: true, dismiss: true });
}

export async function DeleteLocationCustomer(location_id: number, id: number) {
  const supabase = await createSupabaseServerClient();

  return supabase
    .from("business_location_customers")
    .delete()
    .match({ location_id, id });
}
