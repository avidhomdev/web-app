"use server";

import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

export async function UpdateTimesheet<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  if (Object(fields).hasOwnProperty("start_datetime")) {
    const insert = {
      business_id: fields.business_id as string,
      location_id: Number(fields.location_id),
      job_id: Number(fields.job_id),
      start_datetime: dayjs().format("YYYY-MM-DD hh:mm:ss"),
      profile_id: fields.profile_id as string,
    };
    const { error } = await supabase
      .from("business_location_job_timesheets")
      .insert(insert);
    if (error) return formStateResponse({ ...state, error: error.message });
    await supabase.from("business_logs").insert({
      snapshot: JSON.stringify(insert),
      message: `Added start time to timesheet`,
      record_id: fields.job_id as string,
      record_table_name: "business_location_jobs",
      business_id: fields.business_id as string,
      profile_id: fields.profile_id as string,
    });
  } else if (Object(fields).hasOwnProperty("end_datetime")) {
    const update = {
      id: Number(fields.id),
      end_datetime: dayjs().format("YYYY-MM-DD hh:mm:ss"),
    };
    const { error } = await supabase
      .from("business_location_job_timesheets")
      .update(update)
      .eq("id", Number(fields.id));

    if (error) return formStateResponse({ ...state, error: error.message });
    await supabase.from("business_logs").insert({
      snapshot: JSON.stringify(update),
      message: `Added end time to timesheet`,
      record_id: fields.job_id as string,
      record_table_name: "business_location_jobs",
      business_id: fields.business_id as string,
      profile_id: fields.profile_id as string,
    });
  }

  revalidatePath(
    `/manage/${fields.business_id}/location/${fields.location_id}/job/${fields.job_id}`,
  );

  return formStateResponse({ ...state, success: true });
}
