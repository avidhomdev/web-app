"use server";

import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { formatArrayFormFieldsIntoDictionary } from "@/utils/format-array-form-fields-into-dictionary";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function AddJobToSchedule<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const insert = {
    business_id: fields.business_id as string,
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

  const { error: insertScheduleError } = await supabase
    .from("business_appointment_profiles")
    .insert(
      Object.values(profilesDictionary).map((profile) => ({
        business_id: insert.business_id,
        appointment_id: data.id,
        profile_id: profile.profile_id as string,
      })),
    );

  if (insertScheduleError)
    return formStateResponse({
      ...newState,
      error: insertScheduleError.message,
    });

  return formStateResponse({ ...newState, success: true, dismiss: true });
}
