"use client";

import { DAYJS_COMPACT_DATE, DAYJS_DATETIME } from "@/enums/dayjs-formats";
import { Tables } from "@/types/supabase";
import { DocusignEnvelope } from "@/utils/docusign";
import dayjs from "dayjs";
import {
  Badge,
  Button,
  createTheme,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  theme,
} from "flowbite-react";
import { DownloadIcon } from "lucide-react";
import { useTransition } from "react";
import { twMerge } from "tailwind-merge";
import { getDocumentCertificateUri } from "./action";

type DocumentsTableProps = {
  documents: Tables<"business_location_job_docusign_envelopes">[];
  envelopes: DocusignEnvelope[];
};

function getStatusBadgeColor(status: string) {
  const dictionary = {
    sent: "cyan",
    delivered: "lime",
    completed: "green",
    signed: "green",
    declined: "red",
  };
  return dictionary[status as keyof typeof dictionary] || "blue";
}

function DownloadButton({
  envelopeId,
  businessId,
}: {
  envelopeId: string;
  businessId: string;
}) {
  const [isGettingDownloadUrl, startGettingDownloadUrl] = useTransition();

  return (
    <Button
      className="cursor-pointer"
      color="alternative"
      onClick={() =>
        startGettingDownloadUrl(() =>
          getDocumentCertificateUri(businessId, envelopeId).then((blob) => {
            if (!blob) throw new Error("Failed to fetch document");
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `document-${envelopeId}-${dayjs().format(
              DAYJS_DATETIME,
            )}.pdf`;
            a.style.display = "none";
            a.style.visibility = "hidden";
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
          }),
        )
      }
      size="sm"
    >
      {isGettingDownloadUrl ? (
        <Spinner className="size-5" />
      ) : (
        <DownloadIcon className="size-4" />
      )}
    </Button>
  );
}

export default function DocumentsTable({
  documents,
  envelopes,
}: DocumentsTableProps) {
  const envelopeDictionary = envelopes.reduce<Record<string, DocusignEnvelope>>(
    (dictionary, envelope) => {
      if (!envelope.envelopeId) return dictionary;

      dictionary[envelope.envelopeId] = envelope;
      return dictionary;
    },
    {},
  );

  return (
    <Table striped>
      <TableHead
        theme={createTheme({
          base: "rounded-none",
          cell: {
            base: twMerge(
              theme.table.head.cell.base,
              "capitalize tracking-wide text-gray-500 text-sm font-normal",
            ),
          },
        })}
      >
        <TableRow>
          <TableHeadCell>Subject</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell>Send Date</TableHeadCell>
          <TableHeadCell>Download</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {documents.map((doc) => {
          const envelope = envelopeDictionary[doc.envelope_id];

          return (
            <TableRow key={doc.envelope_id}>
              <TableCell>{envelope.emailSubject}</TableCell>
              <TableCell>
                <div className="flex uppercase">
                  <Badge color={getStatusBadgeColor(envelope.status)}>
                    {envelope.status}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                {dayjs(envelope.sentDateTime).format(DAYJS_COMPACT_DATE)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  {envelope.status === "completed" && (
                    <DownloadButton
                      businessId={doc.business_id}
                      envelopeId={doc.envelope_id}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
