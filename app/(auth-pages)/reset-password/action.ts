import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function ResetPassword(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();
  const newPassword = formData.get("newPassword") as string;
  const confirmNewPassword = formData.get("confirmNewPassword") as string;

  if (newPassword !== confirmNewPassword) {
    redirect(`/reset-password?error=Passwords do not match`);
  }
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) redirect(`/reset-password?error=${error.message}`);
  redirect("/manage");
}
