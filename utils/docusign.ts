import { BusinessIntegration } from "@/types/business-integrations";
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
  if (!baseUri || !resource) {
    throw new Error("Base URI and resource are required to generate URL");
  }
  const endpoint = resource.startsWith("/") ? resource.slice(1) : resource;

  return `${baseUri}/restapi/v2.1/${endpoint}`;
}

async function getBusinessIntegrationData(businessId: string) {
  const supabase = await createSupabaseServerClient({ admin: true });
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

export async function refreshAccessToken(
  businessId: string,
  integration?: BusinessIntegration,
) {
  const { refresh_token } =
    integration || (await getBusinessIntegrationData(businessId));
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
  const supabase = await createSupabaseServerClient({ admin: true });
  await supabase.from("business_integrations").upsert({
    business_id: businessId,
    expires_at: Date.now() + expires_in * 1000,
    refresh_token: newRefreshToken, // New refresh token issued
    resource: "docusign",
    token: access_token,
  });

  return access_token;
}

export async function getAccessToken(
  businessId: string,
  integration?: BusinessIntegration,
) {
  const { expires_at, token } =
    integration || (await getBusinessIntegrationData(businessId));
  if (!expires_at) return;

  // 5-minute buffer to refresh proactively
  if (expires_at > Date.now() + 300000) return token;

  return await refreshAccessToken(businessId, integration);
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
        textTabs: { tabLabel: string; value: string | null }[];
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
    });
}

export async function sendEnvelopeTemplateWithIntegrationData({
  integration,
  data,
}: {
  integration: BusinessIntegration;
  data: {
    templateId: string;
    templateRoles: {
      email: string;
      name: string;
      roleName: string;
      tabs?: {
        textTabs: { tabLabel: string; value: string | null }[];
      };
    }[];
    status: string;
  };
}) {
  const accessToken = await getAccessToken(
    integration.business_id,
    integration,
  );
  const { account_id: accountId, base_uri: baseUri } = integration;

  const envelopesApiUrl = generateDocusignRestApiUrl({
    baseUri: baseUri as string,
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
    });
}

export async function getEnvelope({
  businessId,
  envelopeId,
}: {
  businessId: string;
  envelopeId: string;
}) {
  const accessToken = await getAccessToken(businessId);
  const { account_id: accountId, base_uri: baseUri } =
    await getBusinessIntegrationData(businessId);

  const envelopesApiUrl = generateDocusignRestApiUrl({
    baseUri,
    resource: `/accounts/${accountId}/envelopes/${envelopeId}`,
  });

  return fetch(envelopesApiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  }).then((response) => response.json());
}

export interface DocusignEnvelope {
  purgeState: string;
  allowComments: string;
  allowMarkup: string;
  allowReassign: string;
  anySigner: string;
  attachmentsUri: string;
  autoNavigation: string;
  burnDefaultTabData: string;
  certificateUri: string;
  createdDateTime: string;
  customFieldsUri: string;
  documentsCombinedUri: string;
  documentsUri: string;
  emailSubject: string;
  enableWetSign: string;
  envelopeId: string;
  envelopeIdStamping: string;
  envelopeLocation: string;
  envelopeUri: string;
  expireAfter: string;
  expireDateTime: string;
  expireEnabled: string;
  initialSentDateTime: string;
  isSignatureProviderEnvelope: string;
  lastModifiedDateTime: string;
  notificationUri: string;
  recipientsUri: string;
  sender: {
    userName: string;
    userId: string;
    accountId: string;
    email: string;
    ipAddress: string;
  };
  sentDateTime: string;
  signingLocation: string;
  status: string;
  statusChangedDateTime: string;
  templatesUri: string;
  uSigState: string;
}

export async function listDocusignEnvelopes({
  businessId,
  envelopeIds,
}: {
  businessId: string;
  envelopeIds: string[];
}): Promise<DocusignEnvelope[]> {
  const accessToken = await getAccessToken(businessId);
  const { account_id: accountId, base_uri: baseUri } =
    await getBusinessIntegrationData(businessId);

  const envelopesApiUrl = generateDocusignRestApiUrl({
    baseUri,
    resource: `/accounts/${accountId}/envelopes?envelope_ids=${envelopeIds.join(",")}&include=documents`,
  });

  return fetch(envelopesApiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then(({ envelopes = [] }) => envelopes || []);
}

export async function dynamicDocusignFetch({
  businessId,
  uri,
}: {
  businessId: string;
  uri: string;
}): Promise<Response> {
  const accessToken = await getAccessToken(businessId);
  const { account_id: accountId, base_uri: baseUri } =
    await getBusinessIntegrationData(businessId);

  const dynamicResource = generateDocusignRestApiUrl({
    baseUri,
    resource: `/accounts/${accountId}${uri}`,
  });

  return fetch(dynamicResource, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  });
}
