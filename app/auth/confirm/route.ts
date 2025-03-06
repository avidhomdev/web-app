import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const type = searchParams.get("type") as EmailOtpType;
  const email = searchParams.get("email") as string;
  const next = searchParams.get("next") ?? "/manage";

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    email: email ?? "",
    token: token ?? "",
    type,
  });

  if (!error) redirect(next);
  redirect(`/error?message=${error.message}`);
}
