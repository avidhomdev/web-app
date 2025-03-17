import { createSupabaseServerClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const searchParams = request.nextUrl.searchParams;
  const businessId = searchParams.get("businessId");
  const redirectPath = `/manage/${businessId}/settings/integrations`;
  const redirectUrl = (path: string) => new URL(path, request.nextUrl);

  const { data: integration, error } = await supabase
    .from("business_integrations")
    .select()
    .match({ business_id: businessId, resource: "docusign" })
    .single();

  if (error)
    return NextResponse.redirect(
      redirectUrl(`${redirectPath}?error=${error.message}&resource=docusign`),
    );

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
    return NextResponse.redirect(
      redirectUrl(`${redirectPath}?error=${error.message}&resource=docusign`),
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
    return NextResponse.redirect(
      redirectUrl(`${redirectPath}?error=${error.message}&resource=docusign`),
    );
  });

  const { error: updateError } = await supabase
    .from("business_integrations")
    .update({
      account_id: null,
      authorized_on_date: null,
      expires_at: null,
      refresh_token: null,
      revoked_on_date: dayjs().format("YYYY-MM-DD"),
      status: "inactive",
      token: null,
    })
    .match({ business_id: businessId, resource: "docusign" });

  if (updateError)
    return NextResponse.redirect(
      redirectUrl(
        `${redirectPath}?error=${updateError.message}&resource=docusign`,
      ),
    );

  revalidatePath(redirectPath);

  return NextResponse.redirect(
    redirectUrl(
      `${redirectPath}?revoke=DocuSign access has been revoked.&resource=docusign`,
    ),
  );
}
