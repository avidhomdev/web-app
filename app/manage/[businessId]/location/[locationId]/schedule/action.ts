"use server";

import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { Database } from "@/types/supabase";
import { formatArrayFormFieldsIntoDictionary } from "@/utils/format-array-form-fields-into-dictionary";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function AddJobToSchedule<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const insert = {
    business_id: fields.business_id as string,
    customer_id: Number(fields.customer_id),
    location_id: Number(fields.location_id),
    job_id: Number(fields.job_id),
    start_datetime: fields.start_datetime as string,
    end_datetime: fields.end_datetime as string,
  };

  const profilesDictionary = formatArrayFormFieldsIntoDictionary(
    "profiles",
    fields,
  );

  const newState = {
    ...state,
    data: { ...fields, profiles: profilesDictionary },
  };

  if (Object.entries(profilesDictionary).length === 0) {
    return formStateResponse({
      ...newState,
      error: "Please select at least 1 installer",
    });
  }
  const { data, error } = await supabase
    .from("business_appointments")
    .insert(insert)
    .eq("id", Number(fields.job_id))
    .select("id")
    .single();

  if (error) return formStateResponse({ ...newState, error: error.message });

  const { error: insertAppointmentProfileError } = await supabase
    .from("business_appointment_profiles")
    .insert(
      Object.values(profilesDictionary).map((profile) => ({
        business_id: insert.business_id,
        appointment_id: data.id,
        profile_id: profile.profile_id as string,
      })),
    );

  if (insertAppointmentProfileError)
    return formStateResponse({
      ...newState,
      error: insertAppointmentProfileError.message,
    });

  const { error: updateJobStatusError } = await supabase
    .from("business_location_jobs")
    .update({ status: "scheduled" })
    .eq("id", Number(fields.job_id));

  if (updateJobStatusError)
    return formStateResponse({
      ...newState,
      error: updateJobStatusError.message,
    });

  const { error: insertJobProfileError } = await supabase
    .from("business_location_job_profiles")
    .insert(
      Object.values(profilesDictionary).map((profile) => ({
        business_id: insert.business_id,
        location_id: Number(fields.location_id),
        job_id: Number(fields.job_id),
        profile_id: profile.profile_id as string,
        role: "installer" as Database["public"]["Enums"]["job_roles"],
      })),
    );

  if (insertJobProfileError)
    return formStateResponse({
      ...newState,
      error: insertJobProfileError.message,
    });

  return formStateResponse({ ...newState, success: true, dismiss: true });
}
