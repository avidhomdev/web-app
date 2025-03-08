import ErrorAlert from "@/components/error-alert";
import { Tables } from "@/types/supabase";
import { getAccessToken, IUserInfo } from "@/utils/docusign";
import { Alert, Button, Card } from "flowbite-react";
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

export default async function DocusignIntegrationCard({
  businessId,
  error,
  integration,
  resource,
  revoke,
  success,
}: {
  businessId: string;
  error: string | undefined;
  integration?: Tables<"business_integrations">;
  resource: string | undefined;
  revoke: string | undefined;
  success: string | undefined;
}) {
  const res: IUserInfo = await getBusinessDocusignUserInfo(businessId);
  const { accounts } = res;

  const hasAccount = Boolean(integration?.account_id && integration?.base_uri);

  return (
    <Card>
      <div>
        <h3 className="font-semibold">DocuSign</h3>
        <p>Send documents to your customers for easy signatures</p>
      </div>
      {resource === "docusign" && (
        <>
          {error && <ErrorAlert message={error} />}
          {revoke && (
            <Alert color="red">
              <strong className="font-semibold">Access Revoked.</strong> Please
              connect your account again if you wish to use DocuSign.
            </Alert>
          )}
          {success && (
            <Alert color="success">
              <strong className="font-semibold">Success!</strong> {success}
            </Alert>
          )}
        </>
      )}
      {integration ? (
        <>
          <AccountDetails accounts={accounts} integration={integration} />
          {hasAccount && (
            <TemplatesTable businessId={businessId} integration={integration} />
          )}
        </>
      ) : (
        <div className="flex">
          <Button href={docusignOauthUrl({ businessId })}>Connect</Button>
        </div>
      )}
    </Card>
  );
}
