import { PropsWithChildren } from "react";
import { CustomerHeader } from "./customer-header";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ customerId: string }> }>) {
  const { customerId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: customer, error } = await supabase
    .from("business_location_customers")
    .select("*")
    .eq("id", Number(customerId))
    .maybeSingle();

  if (error) throw error;
  if (!customer) notFound();

  return (
    <div className="relative container flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <CustomerHeader customer={customer} />
      {children}
    </div>
  );
}
