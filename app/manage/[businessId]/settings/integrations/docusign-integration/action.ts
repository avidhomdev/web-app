"use server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateDocusignIntegrationAccount(formData: FormData) {
  const fields = Object.fromEntries(formData);
  const businessId = fields.business_id as string;
  const accountId = fields.account_id as string;
  const baseUri = fields.base_uri as string;

  const supabase = await createSupabaseServerClient();
  return await supabase
    .from("business_integrations")
    .update({
      account_id: accountId,
      base_uri: baseUri,
    })
    .match({ business_id: businessId, resource: "docusign" })
    .then(({ error }) => {
      if (error)
        return redirect(
          `/manage/${businessId}/settings/integrations?error=${error.message}&resource=docusign`,
        );

      revalidatePath(`/manage/${businessId}/settings/integrations`);
      return redirect(
        `/manage/${businessId}/settings/integrations?success=Account updated&resource=docusign`,
      );
    });
}
