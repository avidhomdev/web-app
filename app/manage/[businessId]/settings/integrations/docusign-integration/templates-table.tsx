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

export default async function TemplatesTable({
  businessId,
}: {
  businessId: string;
}) {
  const templates: IDocusignTemplate[] =
    await getBusinessDocusignTemplates(businessId);

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
