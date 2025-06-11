import { BusinessIntegration } from "@/types/business-integrations";
import { getAccessToken, IUserInfo } from "@/utils/docusign";
import { Button, Card } from "flowbite-react";
import AccountDetails from "./account-details";
import TemplatesTable from "./templates-table";

function docusignOauthUrl({ businessId }: { businessId: string }) {
  const searchParams = new URLSearchParams({
    response_type: "code",
    scope: "signature user_read",
    client_id: process.env.DOCUSIGN_INTEGRATION_KEY!,
    redirect_uri: `${process.env.DOCUSIGN_REDIRECT_URI}/docusign/callback`,
    state: businessId,
  });

  return `${process.env.NEXT_PUBLIC_DOCUSIGN_OAUTH_URL}?${searchParams.toString()}`;
}

async function getBusinessDocusignUserInfo(businessId: string) {
  const accessToken = await getAccessToken(businessId);
  return fetch(process.env.NEXT_PUBLIC_DOCUSIGN_USERINFO_URL!, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((response) => response.json());
}

async function DocusignAccount({
  businessId,
  integration,
}: {
  businessId: string;
  integration: BusinessIntegration;
}) {
  const res: IUserInfo = await getBusinessDocusignUserInfo(businessId);
  const { accounts } = res;

  const hasAccount = Boolean(integration?.account_id && integration?.base_uri);

  return (
    <>
      <AccountDetails accounts={accounts} integration={integration} />
      {hasAccount && (
        <TemplatesTable businessId={businessId} integration={integration} />
      )}
    </>
  );
}

export default async function DocusignIntegrationCard({
  businessId,
  integration,
}: {
  businessId: string;
  integration?: BusinessIntegration;
}) {
  return (
    <Card>
      <div>
        <h3 className="font-semibold">DocuSign</h3>
        <p>Send documents to your customers for easy signatures</p>
      </div>
      {integration ? (
        <DocusignAccount businessId={businessId} integration={integration} />
      ) : (
        <div className="flex">
          <Button href={docusignOauthUrl({ businessId })}>Connect</Button>
        </div>
      )}
    </Card>
  );
}
