"use server";

import {
  formStateResponse,
  initialFormState,
} from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { Database, Tables } from "@/types/supabase";
import { createSupabaseServerClient } from "@/utils/supabase/server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function AddBusinessLocation<T>(
  ...args: ServerActionWithState<T>
) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;

  const fields = Object.fromEntries(formData);

  const { data, error } = await supabase
    .from("business_locations")
    .insert({
      name: fields.name as string,
      address: fields.address as string,
      address2: fields.address2 as string,
      city: fields.city as string,
      state: fields.state as string,
      postal_code: fields.postal_code as string,
      business_id: fields.business_id as string,
    })
    .select("id")
    .single();

  if (error) {
    return formStateResponse({ ...state, error: error.message });
  }

  const { error: insertLocationProfileError } = await supabase
    .from("business_location_profiles")
    .insert({
      profile_id: fields.profile_id as string,
      business_id: fields.business_id as string,
      location_id: data.id,
      role: "admin" as Database["public"]["Enums"]["business_roles"],
    });

  if (insertLocationProfileError) {
    return formStateResponse({
      ...state,
      error: insertLocationProfileError.message,
    });
  }

  return formStateResponse({
    success: true,
    dismiss: true,
    data: `/manage/${fields.business_id}/location/${data.id}`,
  });
}

export async function UpdateBusinessLocation<T>(
  ...args: ServerActionWithState<T>
) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;

  const fields = Object.fromEntries(formData);

  const { error } = await supabase
    .from("business_locations")
    .update({
      name: fields.name as string,
      address: fields.address as string,
      address2: fields.address2 as string,
      city: fields.city as string,
      state: fields.state as string,
      postal_code: fields.postal_code as string,
    })
    .eq("id", Number(fields.id));

  if (error) {
    return {
      ...state,
      success: false,
      error: error.message,
    };
  }

  return { ...initialFormState, success: true, dismiss: true };
}

export async function DeleteBusinessLocation(
  location: Tables<"business_locations">,
) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("business_locations").delete().eq("id", location.id);

  const origin = (await headers()).get("origin");
  return redirect(`${origin}/manage/${location.business_id}/location`);
}
