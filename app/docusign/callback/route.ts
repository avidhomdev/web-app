/* eslint-disable no-console */
import { createSupabaseServerClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code") as string;
  const businessId = searchParams.get("state") as string;

  const redirectUrl = (path: string) => new URL(path, request.url);
  const redirectBasePath = `/manage/${businessId}/settings/integrations`;

  if (!code || !businessId) {
    return NextResponse.redirect(
      redirectUrl(`${redirectBasePath}?error=Missing code or id`),
    );
  }

  const docusignTokenParams = new URLSearchParams({
    grant_type: "authorization_code",
    code,
  });

  const docusignTokenUrl = `${process.env.NEXT_PUBLIC_DOCUSIGN_TOKEN_URL}?${docusignTokenParams.toString()}`;
  const authString = `${process.env.DOCUSIGN_INTEGRATION_KEY}:${process.env.DOCUSIGN_SECRET_KEY}`;
  const authStringBase64 = Buffer.from(authString).toString("base64");

  console.log({ docusignTokenParams, docusignTokenUrl, authString });

  const fetchAccessToken = await fetch(docusignTokenUrl, {
    headers: {
      Authorization: `Basic ${authStringBase64}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  })
    .then((res) => res.json())
    .catch(console.log);

  console.log({ fetchAccessToken });
  if (!fetchAccessToken?.access_token) {
    return NextResponse.redirect(
      redirectUrl(`${redirectBasePath}?error=Failure to find access token`),
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("business_integrations").upsert({
    authorized_on_date: dayjs().format("YYYY-MM-DD"),
    business_id: businessId,
    expires_at: Date.now() + fetchAccessToken.expires_in * 1000,
    refresh_token: fetchAccessToken.refresh_token,
    resource: "docusign",
    revoked_on_date: null,
    status: "active",
    token: fetchAccessToken.access_token,
    type: "oauth",
  });

  revalidatePath(redirectBasePath);

  if (error) {
    return NextResponse.redirect(
      redirectUrl(`${redirectBasePath}?error=${error.message}`),
    );
  }

  return NextResponse.redirect(
    redirectUrl(
      `${redirectBasePath}?success=DocuSign authenticated successfully.`,
    ),
  );
}
