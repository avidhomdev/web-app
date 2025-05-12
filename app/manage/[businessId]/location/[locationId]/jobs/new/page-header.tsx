"use client";

import PageHeaderWithActions from "@/components/page-header-with-actions";
import { Breadcrumb, BreadcrumbItem } from "flowbite-react";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function PageHeader() {
  const { businessId, locationId } = useParams();
  return (
    <PageHeaderWithActions
      title="New Job"
      subtitle="Add a new job"
      renderBreadcrumbs={() => (
        <Breadcrumb aria-label="Back to jobs">
          <BreadcrumbItem
            href={`/manage/${businessId}/location/${locationId}/jobs`}
            icon={ChevronLeft}
          >
            Back to Jobs
          </BreadcrumbItem>
        </Breadcrumb>
      )}
    />
  );
}
