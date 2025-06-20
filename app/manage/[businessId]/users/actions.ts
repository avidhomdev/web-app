"use server";

import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { Database } from "@/types/supabase";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function SearchOrInviteUser<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  if (!fields.profile_id && !fields.inviting_new) {
    const { data: foundUser, error: getUserIdByEmailError } = await supabase
      .rpc("get_user_id_by_email", {
        email: fields.email as string,
      })
      .maybeSingle();

    if (getUserIdByEmailError) {
      return formStateResponse({ error: getUserIdByEmailError.message });
    }

    if (foundUser) {
      const { data: foundUserProfile } = await supabase
        .from("profiles")
        .select("id,full_name,avatar_url")
        .eq("id", foundUser.id)
        .limit(1)
        .single();

      return formStateResponse({ data: foundUserProfile });
    }

    return formStateResponse({ data: "confirm-invite" });
  }

  if (fields.profile_id) {
    const { error } = await supabase.from("business_profiles").upsert({
      business_id: fields.business_id as string,
      profile_id: fields.profile_id as string,
      role: fields.role as Database["public"]["Enums"]["business_roles"],
    });

    if (error) {
      return formStateResponse({ ...state, error: error.message });
    }
  } else if (fields.inviting_new) {
    const supabaseAdmin = await createSupabaseServerClient({ admin: true });
    const origin = (await headers()).get("origin");

    const { data, error: inviteError } =
      await supabaseAdmin.auth.admin.createUser({
        email: fields.email as string,
        password: "Avidturf123!",
        user_metadata: { full_name: fields.full_name as string },
        email_confirm: true,
      });

    if (inviteError) {
      return formStateResponse({ ...state, error: inviteError.message });
    }

    const { error } = await supabase.from("business_profiles").upsert({
      business_id: fields.business_id as string,
      profile_id: data.user.id,
      role: fields.role as Database["public"]["Enums"]["business_roles"],
    });

    if (error) {
      return formStateResponse({ ...state, error: error.message });
    }
  }

  return formStateResponse({ success: true, dismiss: true });
}

export async function UpdateBusinessUser<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const { error } = await supabase
    .from("business_profiles")
    .update({
      role: fields.role as Database["public"]["Enums"]["business_roles"],
    })
    .match({ business_id: fields.business_id, profile_id: fields.profile_id });

  if (error) {
    return formStateResponse({ ...state, error: error.message });
  }

  return formStateResponse({ success: true, dismiss: true });
}

export async function DeleteBusinessUser(
  business_id: string,
  profile_id: string,
) {
  const supabase = await createSupabaseServerClient();

  return supabase
    .from("business_profiles")
    .delete()
    .match({ business_id, profile_id });
}
