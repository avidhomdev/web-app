import { BusinessContextProvider, IBusiness } from "@/contexts/business";
import { createSupabaseServerClient } from "@/utils/supabase/server";

import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import ManageSidebar from "./manage-sidebar";
import ManageNav from "./manage-nav";
import AppToasts from "./app-toasts";
import { SidebarProvider } from "@/contexts/sidebar";

export default async function Layout(
  props: PropsWithChildren<{ params: { businessId: string } }>,
) {
  const params = await props.params;

  const { businessId } = params;

  const { children } = props;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("businesses")
    .select(
      `
      *,
      profiles: business_profiles(*, profile: profile_id(*)),
      locations: business_locations!business_locations_business_id_fkey(*),
      products: business_products!business_products_business_id_fkey(*)
      `,
    )
    .eq("id", businessId)
    .limit(1)
    .maybeSingle()
    .overrideTypes<IBusiness>();

  if (error) throw error;
  if (!data) notFound();

  return (
    <BusinessContextProvider business={data}>
      <SidebarProvider initialCollapsed>
        <ManageNav />
        <main className="relative mt-20 sm:mt-16 md:flex">
          <ManageSidebar />
          <div className="container relative flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </div>
        </main>
        <AppToasts />
      </SidebarProvider>
    </BusinessContextProvider>
  );
}
