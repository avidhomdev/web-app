import { createSupabaseServerClient } from "./supabase/server";

export interface IUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  accounts: IDocusignAccount[];
  creaated: string;
}

export interface IDocusignAccount {
  account_id: string;
  account_name: string;
  base_uri: string;
  is_default: boolean;
}

const clientId = process.env.DOCUSIGN_INTEGRATION_KEY!;
const clientSecret = process.env.DOCUSIGN_SECRET_KEY!;
const tokenEndpoint = process.env.NEXT_PUBLIC_DOCUSIGN_TOKEN_URL;

// Refresh access token
export async function refreshAccessToken(businessId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("business_integrations")
    .select("refresh_token")
    .match({ business_id: businessId, resource: "docusign" })
    .single();

  if (error || !data?.refresh_token) throw new Error("No refresh token found");

  const refreshTokenParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: data.refresh_token,
  });

  const refreshTokenUrl = `${tokenEndpoint}?${refreshTokenParams.toString()}`;

  const response = await fetch(refreshTokenUrl, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
  }).then((res) => res.json());

  const { access_token, refresh_token, expires_in } = response;
  await supabase.from("business_integrations").upsert({
    business_id: businessId,
    expires_at: Date.now() + expires_in * 1000,
    refresh_token, // New refresh token issued
    resource: "docusign",
    token: access_token,
  });

  return access_token;
}

// Get or refresh access token
export async function getAccessToken(businessId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("business_integrations")
    .select("token, refresh_token, expires_at")
    .match({ business_id: businessId, resource: "docusign" })
    .single();

  if (!data || !data.expires_at) return;

  // 5-minute buffer to refresh proactively
  if (data.expires_at > Date.now() + 300000) return data.token;

  return await refreshAccessToken(businessId);
}

// // Get base URI for API calls
// export async function getBaseUri(tenantId: string) {
//   const accessToken = await getAccessToken(tenantId);
//   const response = await axios.get(
//     "https://account-d.docusign.com/oauth/userinfo",
//     {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     },
//   );

//   // Assume first account; adjust if multi-account per user
//   return response.data.accounts[0].base_uri;
// }

// List envelopes (example API call)
// export async function listEnvelopes(tenantId: string) {
//   const accessToken = await getAccessToken(tenantId);
//   const baseUri = await getBaseUri(tenantId);
//   const accountId = (
//     await axios.get("https://account-d.docusign.com/oauth/userinfo", {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     })
//   ).data.accounts[0].account_id;

//   const response = await axios.get(
//     `${baseUri}/restapi/v2.1/accounts/${accountId}/envelopes`,
//     {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     },
//   );
//   return response.data.envelopes;
// }
