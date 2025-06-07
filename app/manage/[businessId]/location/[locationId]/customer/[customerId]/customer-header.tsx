"use client";

import PageTabs from "@/components/page-tabs";
import { Tables } from "@/types/supabase";
import { Breadcrumb, BreadcrumbItem, ChevronLeftIcon } from "flowbite-react";
import { useParams, usePathname } from "next/navigation";

export function CustomerHeader({
  customer,
}: {
  customer: Tables<"business_location_customers">;
}) {
  const { customerId, businessId, locationId } = useParams();
  const pathname = usePathname();

  const tabs = [
    {
      active:
        pathname ===
        `/manage/${businessId}/location/${locationId}/customer/${customerId}`,
      href: `/manage/${businessId}/location/${locationId}/customer/${customerId}`,
      title: "Dashboard",
    },
    {
      active: pathname.startsWith(
        `/manage/${businessId}/location/${locationId}/customer/${customerId}/bids`,
      ),
      href: `/manage/${businessId}/location/${locationId}/customer/${customerId}/bids`,
      title: "Bids",
    },
    {
      active: pathname.startsWith(
        `/manage/${businessId}/location/${locationId}/customer/${customerId}/jobs`,
      ),
      href: `/manage/${businessId}/location/${locationId}/customer/${customerId}/jobs`,
      title: "Jobs",
    },
  ];

  return (
    <header className="space-y-4 text-gray-500 dark:text-gray-300">
      <Breadcrumb aria-label="Default breadcrumb example">
        <BreadcrumbItem
          href={`/manage/${businessId}/location/${locationId}/customers`}
          icon={() => <ChevronLeftIcon className="mr-1" />}
        >
          Back to Customers
        </BreadcrumbItem>
      </Breadcrumb>

      <hgroup>
        <h1 className="text-2xl">{customer.full_name}</h1>
        <p>{customer.phone}</p>
        <p>{customer.email}</p>
      </hgroup>

      {tabs.length > 1 && (
        <PageTabs>
          {tabs.map((tab) => (
            <PageTabs.Tab key={tab.title} href={tab.href} active={tab.active}>
              {tab.title}
            </PageTabs.Tab>
          ))}
        </PageTabs>
      )}
    </header>
  );
}
