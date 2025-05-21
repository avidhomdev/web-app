"use server";
import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { Database } from "@/types/supabase";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function UpdateJob<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const updates = {
    address: fields.address as string,
    city: fields.city as string,
    state: fields.state as string,
    postal_code: fields.postal_code as string,
    job_status: fields.job_status as Database["public"]["Enums"]["job_status"],
  };

  const { error } = await supabase
    .from("business_location_jobs")
    .update(updates)
    .eq("id", Number(fields.id));

  if (error) {
    return formStateResponse({ ...state, error: error.message });
  }

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(updates),
    message: `Quick updated job`,
    record_id: fields.id as string,
    record_table_name: "business_location_jobs",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  return formStateResponse({ success: true, dismiss: true });
}

export async function DeleteJob(id: number) {
  const supabase = await createSupabaseServerClient();
  return supabase.from("business_location_jobs").delete().eq("id", id);
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

export async function DeleteJobMessage(message_id: number) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("business_location_job_messages")
    .delete()
    .eq("id", message_id);

  if (error) throw error;

  return;
}
