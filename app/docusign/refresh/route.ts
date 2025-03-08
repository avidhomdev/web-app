import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const businessId = searchParams.get("businessId") as string;

  const redirectPath = `/manage/${businessId}/settings/integrations`;
  const redirectUrl = (path: string) => new URL(path, request.nextUrl);

  if (!businessId) {
    return NextResponse.redirect(
      redirectUrl(
        `${redirectPath}?error=Business ID is required&resource=docusign`,
      ),
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error: fetchError } = await supabase
    .from("business_integrations")
    .select("refresh_token")
    .match({ business_id: businessId, resource: "docusign" })
    .single();

  if (fetchError) {
    return NextResponse.redirect(
      redirectUrl(
        `${redirectPath}?error=${fetchError.message}&resource=docusign`,
      ),
    );
  }

  if (!data.refresh_token) {
    return NextResponse.redirect(
      redirectUrl(
        `${redirectPath}?error=No refresh token found&resource=docusign`,
      ),
    );
  }

  const tokenUrlSearchParams = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: data.refresh_token,
    client_id: process.env.DOCUSIGN_INTEGRATION_KEY!,
    client_secret: process.env.DOCUSIGN_SECRET_KEY!,
  });

  const fetchNewTokensUrl = `${process.env.NEXT_PUBLIC_DOCUSIGN_TOKEN_URL}?${tokenUrlSearchParams.toString()}`;

  return fetch(fetchNewTokensUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((res) => res.json())
    .then(async (data) => {
      const { access_token, refresh_token, expires_in } = data;
      return supabase.from("business_integrations").upsert({
        business_id: businessId,
        resource: "docusign",
        token: access_token,
        refresh_token,
        expires_at: Date.now() + expires_in * 1000,
      });
    })
    .then(({ error }) => {
      if (error) throw error;

      return NextResponse.redirect(redirectUrl(redirectPath));
    })
    .catch((error) => {
      return NextResponse.redirect(
        redirectUrl(`${redirectPath}?error=${error.message}&resource=docusign`),
      );
    });
}
