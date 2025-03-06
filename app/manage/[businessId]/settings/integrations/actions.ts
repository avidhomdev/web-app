"use server";

import {
  formStateResponse,
  TInitialFormState,
} from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { redirect } from "next/navigation";

async function AddDocuSignIntegration({ businessId }: { businessId: string }) {
  const docusignOauthUrl = `${process.env.NEXT_PUBLIC_DOCUSIGN_OAUTH_URL}?response_type=code&scope=impersonation signature user_read&client_id=${process.env.DOCUSIGN_INTEGRATION_KEY}&redirect_uri=${process.env.DOCUSIGN_REDIRECT_URI}/manage/${businessId}/settings/integrations/docusign/callback`;

  return redirect(docusignOauthUrl);
}

export async function AddIntegration(
  ...args: ServerActionWithState<TInitialFormState>
) {
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  if (!fields.resource) {
    return formStateResponse({
      error: "Please select a resource to integrate with.",
    });
  }

  if (fields.resource === "docusign") {
    return AddDocuSignIntegration({ businessId: fields.businessId as string });
  }
  return formStateResponse({ ...state, error: null, success: true });
}
