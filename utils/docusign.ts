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

export interface IDocusignTemplate {
  templateId: string;
  uri: string;
  name: string;
  shared: string;
  passwordProtected: string;
  description: string;
  created: string;
  lastModified: string;
  lastUsed: string;
  owner: {
    userName: string;
    userId: string;
    email: string;
  };
  pageCount: string;
  folderId: string;
  folderName: string;
  folderIds: string[];
  autoMatch: string;
  autoMatchSpecifiedByUser: string;
  emailSubject: string;
  emailBlurb: string;
  signingLocation: string;
  authoritativeCopy: string;
  enforceSignerVisibility: string;
  enableWetSign: string;
  allowMarkup: string;
  allowReassign: string;
  disableResponsiveDocument: string;
  anySigner: string | null;
  envelopeLocation: string | null;
}

const clientId = process.env.DOCUSIGN_INTEGRATION_KEY!;
const clientSecret = process.env.DOCUSIGN_SECRET_KEY!;
const tokenEndpoint = process.env.NEXT_PUBLIC_DOCUSIGN_TOKEN_URL;

export function generateDocusignRestApiUrl({
  baseUri,
  resource,
}: {
  baseUri: string;
  resource: string;
}) {
  return `${baseUri}/restapi/v2.1/${resource}`;
}

async function getBusinessIntegrationData(businessId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("business_integrations")
    .select("*")
    .match({ business_id: businessId, resource: "docusign" })
    .single();

  if (error || !data) throw new Error("No integration data found");

  return {
    ...data,
    base_uri: data.base_uri
      ? data.base_uri
      : process.env.NEXT_PUBLIC_DOCUSIGN_REST_API!,
  };
}

export async function refreshAccessToken(businessId: string) {
  const { refresh_token } = await getBusinessIntegrationData(businessId);
  if (!refresh_token) throw new Error("No refresh token found");

  const refreshTokenParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  });

  const refreshTokenUrl = `${tokenEndpoint}?${refreshTokenParams.toString()}`;

  const response = await fetch(refreshTokenUrl, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST",
  }).then((res) => res.json());

  const { access_token, refresh_token: newRefreshToken, expires_in } = response;
  const supabase = await createSupabaseServerClient();
  await supabase.from("business_integrations").upsert({
    business_id: businessId,
    expires_at: Date.now() + expires_in * 1000,
    refresh_token: newRefreshToken, // New refresh token issued
    resource: "docusign",
    token: access_token,
  });

  return access_token;
}

export async function getAccessToken(businessId: string) {
  const { expires_at, token } = await getBusinessIntegrationData(businessId);
  if (!expires_at) return;

  // 5-minute buffer to refresh proactively
  if (expires_at > Date.now() + 300000) return token;

  return await refreshAccessToken(businessId);
}

export async function getBusinessDocusignTemplates(
  businessId: string,
): Promise<IDocusignTemplate[]> {
  const accessToken = await getAccessToken(businessId);
  const { account_id: accountId, base_uri: baseUri } =
    await getBusinessIntegrationData(businessId);

  if (!accessToken || !baseUri) return [];

  const envlopesApiUrl = generateDocusignRestApiUrl({
    baseUri,
    resource: `/accounts/${accountId}/templates`,
  });

  return fetch(envlopesApiUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((response) => response.json())
    .then((data) => data.envelopeTemplates);
}

export async function createBusinessDocusignEnvelopeFromTemplate({
  businessId,
  data,
}: {
  businessId: string;
  data: {
    templateId: string;
    templateRoles: {
      email: string;
      name: string;
      roleName: string;
      tabs?: {
        textTabs: { tabLabel: string; value: string }[];
      };
    }[];
    status: string;
  };
}) {
  const accessToken = await getAccessToken(businessId);
  const { account_id: accountId, base_uri: baseUri } =
    await getBusinessIntegrationData(businessId);

  const envelopesApiUrl = generateDocusignRestApiUrl({
    baseUri,
    resource: `/accounts/${accountId}/envelopes`,
  });

  return fetch(envelopesApiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((res) => {
      return res;
    })
    .catch(console.log);
}
