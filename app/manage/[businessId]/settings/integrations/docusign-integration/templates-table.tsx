import { BusinessIntegration } from "@/types/business-integrations";
import {
  getBusinessDocusignTemplates,
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
import ToggleTableContractButton from "./toggle-job-contract-button";

export default async function TemplatesTable({
  businessId,
  integration,
}: {
  businessId: string;
  integration: BusinessIntegration;
}) {
  const templates: IDocusignTemplate[] =
    await getBusinessDocusignTemplates(businessId);
  const { jobContractTemplateId = "" } = integration.metadata;

  return (
    <>
      <hgroup>
        <h3 className="font-semibold">Templates</h3>
        <p>
          These are documents you can send to your customers that require
          signing
        </p>
      </hgroup>
      <Table striped className="w-full">
        <TableHead>
          <TableRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Created</TableHeadCell>
            <TableHeadCell className="text-center">Job Contract</TableHeadCell>
          </TableRow>
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
              <TableCell className="flex justify-center">
                <ToggleTableContractButton
                  jobContractTemplateId={jobContractTemplateId}
                  templateId={template.templateId}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
