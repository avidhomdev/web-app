import { Tables } from "@/types/supabase";
import {
  generateDocusignRestApiUrl,
  getAccessToken,
  IDocusignTemplate,
} from "@/utils/docusign";
import { formatAsReadableDate } from "@/utils/formatter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

async function getBusinessDocusignAccountTemplates(
  baseUri: string,
  businessId: string,
  accountId: string,
) {
  const accessToken = await getAccessToken(businessId);
  const envlopesApiUrl = generateDocusignRestApiUrl(
    baseUri,
    `/accounts/${accountId}/templates`,
  );

  return fetch(envlopesApiUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((response) => response.json())
    .then((data) => data.envelopeTemplates);
}

export default async function TemplatesTable({
  businessId,
  integration,
}: {
  businessId: string;
  integration: Tables<"business_integrations">;
}) {
  const templates: IDocusignTemplate[] =
    await getBusinessDocusignAccountTemplates(
      integration.base_uri!,
      businessId,
      integration.account_id!,
    );

  return (
    <>
      <hgroup>
        <h3 className="font-semibold">Templates</h3>
        <p>
          These are documents you can send to your customers that require
          signing
        </p>
      </hgroup>
      <Table className="w-full">
        <TableHead>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Created</TableHeadCell>
        </TableHead>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.templateId}>
              <TableCell>
                <p>
                  {template.name}
                  <br />
                  <small>{template.description}</small>
                </p>
              </TableCell>
              <TableCell>{formatAsReadableDate(template.created)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
