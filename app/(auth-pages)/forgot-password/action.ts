import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function RequestPasswordReset(formData: FormData) {
  "use server";
  const email = formData.get("email") as string;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) redirect(`/forgot-password?error=${error.message}`);
  redirect("/forgot-password?success=true");
}
