"use server";
import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { createSupabaseServerClient } from "@/utils/supabase/server";

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
    return formStateResponse({ ...state, data: fields, error: error.message });
  }

  return formStateResponse({
    ...state,
    data: fields,
    success: true,
    error: null,
  });
}

export async function UpdateContact<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;

  const fields = Object.fromEntries(formData);

  const { error } = await supabase
    .from("profiles")
    .update({
      phone: fields.phone as string,
      address: fields.address as string,
      address2: fields.address2 as string,
      city: fields.city as string,
      state: fields.state as string,
      postal_code: fields.postal_code as string,
    })
    .eq("id", fields.profile_id as string)
    .single();

  if (error) {
    return formStateResponse({ ...state, data: fields, error: error.message });
  }

  return formStateResponse({
    ...state,
    data: fields,
    success: true,
    error: null,
  });
}

export async function UpdateUserPassword<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;

  const fields = Object.fromEntries(formData);

  if (fields.password !== fields.confirm_password) {
    return formStateResponse({
      ...state,
      data: fields,
      success: false,
      error: "Passwords do not match.",
    });
  }

  const { error } = await supabase.auth.updateUser({
    password: fields.password as string,
  });

  if (error) {
    return formStateResponse({
      ...state,
      data: fields,
      success: false,
      error: error.message,
    });
  }

  return formStateResponse({
    ...state,
    data: { password: "", confirm_password: "" },
    success: true,
    error: null,
  });
}
