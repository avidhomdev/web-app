"use client";

import { IJob } from "@/types/job";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Spinner,
} from "flowbite-react";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  HardHatIcon,
  Signature,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";

import PageTabs from "@/components/page-tabs";
import { useBusinessContext } from "@/contexts/business";
import { getJobStatusProperties } from "@/enums/job-status";
import { useTransition } from "react";
import { sendJobDocusignTemplate, UpdateJobStatus } from "./actions";

function handleUpdateJobStatusToPacketComplete(id: number) {
  return () => UpdateJobStatus({ id, job_status: "packet_complete" });
}

export default function JobHeader({ job }: { job: IJob }) {
  const [isUpdatingJobStatus, startUpdatingJobStatus] = useTransition();
  const [isSendingContract, startSendingContract] = useTransition();
  const pathname = usePathname();
  const { businessId, locationId, jobId } = useParams();
  const {
    business: { integrations },
  } = useBusinessContext();

  const docusignIntegration = integrations.find(
    (integration) => integration.resource === "docusign",
  );

  const tabs = [
    {
      href: `/manage/${businessId}/location/${locationId}/job/${jobId}`,
      title: "Dashboard",
    },
    ...(job.documents?.length
      ? [
          {
            href: `/manage/${businessId}/location/${locationId}/job/${jobId}/documents`,
            title: "Documents",
          },
        ]
      : []),
    {
      href: `/manage/${businessId}/location/${locationId}/job/${jobId}/payments`,
      title: "Payments",
    },
  ];

  const activePageTabTitle = tabs.find((tab) => tab.href === pathname);
  const jobStatusProperty = getJobStatusProperties(job.job_status);

  const hasJobContractTemplateId =
    docusignIntegration?.metadata.jobContractTemplateId;

  return (
    <header className="space-y-4 text-gray-500 dark:text-gray-300">
      <Breadcrumb aria-label="Default breadcrumb example">
        <BreadcrumbItem
          href={`/manage/${businessId}/location/${locationId}/jobs`}
          icon={() => <ChevronLeftIcon className="mr-1" />}
        >
          Back to Jobs
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
          <hgroup>
            <span className="text-3xl font-semibold">{job.full_name}</span>
            <h1 className="flex items-center gap-1 text-sm text-gray-400">
              <HardHatIcon className="size-5" />
              {`Job #${jobId}${activePageTabTitle ? ` ${activePageTabTitle.title}` : ""}`}
            </h1>
            <div className="mt-2 flex">
              <Badge color={jobStatusProperty.color}>
                {jobStatusProperty.name}
              </Badge>
            </div>
          </hgroup>
        </div>
        <div className="flex items-center gap-1">
          {job.job_status === "packet_pending" && (
            <Button
              disabled={
                isUpdatingJobStatus ||
                job.documents?.length === 0 ||
                job.payments?.length === 0
              }
              onClick={() =>
                startUpdatingJobStatus(
                  handleUpdateJobStatusToPacketComplete(job.id),
                )
              }
            >
              <div className="mr-2 size-5">
                {isUpdatingJobStatus ? (
                  <Spinner size="sm" />
                ) : (
                  <CheckCircleIcon className="size-5" />
                )}
              </div>
              Packet Complete
            </Button>
          )}
          {hasJobContractTemplateId && job.documents?.length === 0 && (
            <Button
              color="alternative"
              disabled={isSendingContract}
              onClick={() =>
                startSendingContract(() =>
                  sendJobDocusignTemplate({
                    jobId: job.id,
                    templateId:
                      docusignIntegration.metadata.jobContractTemplateId,
                  }),
                )
              }
            >
              <div className="mr-2 size-5">
                {isUpdatingJobStatus ? (
                  <Spinner size="sm" />
                ) : (
                  <Signature className="size-5" />
                )}
              </div>
              Send Contract
            </Button>
          )}
          {job.payments?.length === 0 && (
            <Button
              color="alternative"
              href={`/manage/${job.business_id}/location/${job.business_location_id}/job/${job.id}/payments`}
            >
              Collect Deposit
            </Button>
          )}
        </div>
      </div>
      {tabs.length > 1 && (
        <PageTabs>
          {tabs.map((tab) => (
            <PageTabs.Tab
              key={tab.title}
              href={tab.href}
              active={pathname === tab.href}
            >
              {tab.title}
            </PageTabs.Tab>
          ))}
        </PageTabs>
      )}
    </header>
  );
}
