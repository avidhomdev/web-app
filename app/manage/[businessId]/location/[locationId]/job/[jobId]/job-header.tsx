"use client";

import { IJob } from "@/types/job";
import { Breadcrumb } from "flowbite-react";
import { ChevronLeftIcon, HardHatIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

import PageTabs from "@/components/page-tabs";
import { useBusinessContext } from "@/contexts/business";

export default function JobHeader({ job }: { job: IJob }) {
  const pathname = usePathname();
  const { businessId, locationId, jobId } = useParams();
  const {
    business: { integrations },
  } = useBusinessContext();

  const tabs = [
    {
      href: `/manage/${businessId}/location/${locationId}/job/${jobId}`,
      title: "Dashboard",
    },
    ...(integrations.find((integration) => integration.resource === "docusign")
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

  return (
    <header className="space-y-4 text-gray-500 dark:text-gray-300">
      <Breadcrumb aria-label="Default breadcrumb example">
        <Breadcrumb.Item
          href={`/manage/${businessId}/location/${locationId}/jobs`}
          icon={() => <ChevronLeftIcon className="mr-1" />}
        >
          Back to Jobs
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
        <hgroup>
          <span className="text-3xl font-semibold">{job.full_name}</span>
          <h1 className="flex items-center gap-1 text-sm text-gray-400">
            <HardHatIcon className="size-5" />
            {`Job #${jobId}${activePageTabTitle ? ` ${activePageTabTitle.title}` : ""}`}
          </h1>
        </hgroup>
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
