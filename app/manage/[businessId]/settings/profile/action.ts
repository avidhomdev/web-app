"use server";
import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function UpdateProfile<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;

  const fields = Object.fromEntries(formData);

  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url: fields.avatar_url as string,
      full_name: fields.full_name as string,
      username: fields.username as string,
    })
    .eq("id", fields.profile_id as string)
    .single();

  if (error) {
    return formStateResponse({ ...state, error: error.message });
  }

  revalidatePath(`/manage/${fields.business_id}/settings/profile`);
  return formStateResponse({ ...state, error: "error " });
}
