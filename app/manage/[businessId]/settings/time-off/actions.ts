"use server";
import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function AddTimeOff<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const insert = {
    business_id: fields.business_id as string,
    end_datetime: fields.end_datetime as string,
    name: fields.name as string,
    start_datetime: fields.start_datetime as string,
    type: fields.type as string,
  };

  const newState = {
    ...state,
    data: { ...fields },
  };

  const { data, error } = await supabase
    .from("business_appointments")
    .insert(insert)
    .eq("id", Number(fields.job_id))
    .select("id")
    .single();

  if (error) return formStateResponse({ ...newState, error: error.message });

  const { error: insertAppointmentProfileError } = await supabase
    .from("business_appointment_profiles")
    .insert({
      business_id: insert.business_id,
      appointment_id: data.id,
      profile_id: fields.profile_id as string,
    });

  if (insertAppointmentProfileError)
    return formStateResponse({
      ...newState,
      error: insertAppointmentProfileError.message,
    });

  revalidatePath(`/manage/${fields.business_id}/settings/time-off`);

  return formStateResponse({ ...newState, success: true, dismiss: true });
}
