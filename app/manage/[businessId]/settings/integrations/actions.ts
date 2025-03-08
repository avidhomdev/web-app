"use server";

import {
  formStateResponse,
  TInitialFormState,
} from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { Tables } from "@/types/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function AddDocuSignIntegration({ businessId }: { businessId: string }) {
  const searchParams = new URLSearchParams({
    response_type: "code",
    scope: "signature user_read",
    client_id: process.env.DOCUSIGN_INTEGRATION_KEY!,
    redirect_uri: `${process.env.DOCUSIGN_REDIRECT_URI}/docusign/callback`,
    state: businessId,
  });
  const docusignOauthUrl = `${process.env.NEXT_PUBLIC_DOCUSIGN_OAUTH_URL}?${searchParams.toString()}`;

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
    return AddDocuSignIntegration({ businessId: fields.business_id as string });
  }
  return formStateResponse({ ...state, error: null, success: true });
}

export async function revokeDocusign({
  integration,
}: {
  integration: Tables<"business_integrations">;
}) {
  return async () => {
    const { token, refresh_token } = integration;
    const revokeAccessTokenParams = new URLSearchParams({
      token: token as string,
      token_type_hint: "access_token",
      client_id: process.env.DOCUSIGN_INTEGRATION_KEY!,
      client_secret: process.env.DOCUSIGN_SECRET_KEY!,
    });

    await fetch(
      `${process.env.NEXT_PUBLIC_DOCUSIGN_REVOKE_URL}?${revokeAccessTokenParams.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    ).catch((error) => {
      return redirect(
        `/manage/${integration.business_id}/settings/integrations?error=${error.message}&resource=docusign`,
      );
    });

    const revokeRefreshTokenParams = new URLSearchParams({
      token: refresh_token as string,
      token_type_hint: "refresh_token",
      client_id: process.env.DOCUSIGN_INTEGRATION_KEY!,
      client_secret: process.env.DOCUSIGN_SECRET_KEY!,
    });

    await fetch(
      `${process.env.NEXT_PUBLIC_DOCUSIGN_REVOKE_URL}?${revokeRefreshTokenParams.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    ).catch((error) => {
      return redirect(
        `/manage/${integration.business_id}/settings/integrations?error=${error.message}&resource=docusign`,
      );
    });

    revalidatePath(`/manage/${integration.business_id}/settings/integrations`);

    return redirect(
      `/manage/${integration.business_id}/settings/integrations?revoke=true&resource=docusign`,
    );
  };
}
