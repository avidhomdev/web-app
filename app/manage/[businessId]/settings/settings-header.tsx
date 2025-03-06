"use client";

import PageHeaderWithActions from "@/components/page-header-with-actions";
import PageTabs from "@/components/page-tabs";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

export function SettingsHeader() {
  const { businessId } = useParams();
  const segment = useSelectedLayoutSegment();

  const tabs = [
    {
      active: !segment,
      href: `/manage/${businessId}/settings`,
      title: "General",
    },
    {
      active: segment === "billing",
      href: `/manage/${businessId}/settings/billing`,
      title: "Billing",
    },
    {
      active: segment === "integrations",
      href: `/manage/${businessId}/settings/integrations`,
      title: "Integrations",
    },
    {
      active: segment === "profile",
      href: `/manage/${businessId}/settings/profile`,
      title: "Profile",
    },
  ];

  return (
    <PageHeaderWithActions title="Settings">
      <PageTabs>
        {tabs.map((tab) => (
          <PageTabs.Tab key={tab.title} href={tab.href} active={tab.active}>
            {tab.title}
          </PageTabs.Tab>
        ))}
      </PageTabs>
    </PageHeaderWithActions>
  );
}
