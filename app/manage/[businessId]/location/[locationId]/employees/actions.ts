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
      return formStateResponse({
        ...state,
        data: fields,
        error: getUserIdByEmailError.message,
      });
    }

    if (foundUser) {
      const { data: foundUserProfile } = await supabase
        .from("profiles")
        .select("id,full_name,avatar_url")
        .eq("id", foundUser.id)
        .limit(1)
        .single();

      if (foundUserProfile) {
        return formStateResponse({
          ...state,
          data: { ...fields, ...foundUserProfile },
        });
      }
    }

    return formStateResponse({
      ...state,
      data: { ...fields, id: "confirm-invite" },
    });
  }

  if (fields.profile_id) {
    const { data: foundBusinessProfiles } = await supabase
      .from("business_profiles")
      .select("profile_id")
      .match({
        business_id: fields.business_id as string,
        profile_id: fields.profile_id as string,
      })
      .limit(1);

    if (!foundBusinessProfiles || foundBusinessProfiles.length === 0) {
      const { error: businessProfileUpsertError } = await supabase
        .from("business_profiles")
        .insert({
          business_id: fields.business_id as string,
          profile_id: fields.profile_id as string,
          role: "base" as Database["public"]["Enums"]["business_roles"],
        });
      if (businessProfileUpsertError) {
        return formStateResponse({
          ...state,
          data: fields,
          error: businessProfileUpsertError.message,
        });
      }
    }

    const { error } = await supabase.from("business_location_profiles").upsert({
      business_id: fields.business_id as string,
      location_id: Number(fields.location_id) as number,
      profile_id: fields.profile_id as string,
      role: fields.role as Database["public"]["Enums"]["location_profile_roles"],
      is_setter: fields.is_setter === "yes",
      is_closer: fields.is_closer === "yes",
      is_installer: fields.is_installer === "yes",
    });

    if (error) {
      return formStateResponse({ ...state, error: error.message });
    }
  } else if (fields.inviting_new) {
    const supabaseAdmin = await createSupabaseServerClient({ admin: true });
    const origin = (await headers()).get("origin");

    const { data, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(fields.email as string, {
        data: { full_name: fields.full_name as string },
        redirectTo: `${origin}/auth/callback`,
      });

    if (inviteError) {
      return formStateResponse({
        ...state,
        data: fields,
        error: inviteError.message,
      });
    }

    const { error: businessProfileUpsertError } = await supabase
      .from("business_profiles")
      .upsert({
        business_id: fields.business_id as string,
        profile_id: data.user.id,
        role: fields.role as Database["public"]["Enums"]["business_roles"],
      });

    if (businessProfileUpsertError) {
      return formStateResponse({
        ...state,
        data: fields,
        error: businessProfileUpsertError.message,
      });
    }

    const { error } = await supabase.from("business_location_profiles").upsert({
      business_id: fields.business_id as string,
      location_id: Number(fields.location_id) as number,
      profile_id: data.user.id,
      role: fields.role as Database["public"]["Enums"]["location_profile_roles"],
      is_setter: fields.is_setter === "yes",
      is_closer: fields.is_closer === "yes",
      is_installer: fields.is_installer === "yes",
    });

    if (error) {
      return formStateResponse({
        ...state,
        data: fields,
        error: error.message,
      });
    }
  }

  return formStateResponse({ success: true, data: fields, dismiss: true });
}

export async function UpdateEmployee<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const { error } = await supabase
    .from("business_location_profiles")
    .update({
      closer_priority: Number(fields.closer_priority),
      role: fields.role as Database["public"]["Enums"]["location_profile_roles"],
      is_setter: fields.is_setter === "yes",
      is_closer: fields.is_closer === "yes",
      is_installer: fields.is_installer === "yes",
    })
    .match({ location_id: fields.location_id, profile_id: fields.profile_id });

  if (error) {
    return formStateResponse({ ...state, error: error.message });
  }

  return formStateResponse({ success: true, dismiss: true });
}

export async function DeleteLocationEmployee(
  location_id: number,
  profile_id: string,
) {
  const supabase = await createSupabaseServerClient();

  return supabase
    .from("business_location_profiles")
    .delete()
    .match({ location_id, profile_id });
}
