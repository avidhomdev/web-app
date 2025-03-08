import { createSupabaseServerClient } from "@/utils/supabase/server";
import DocusignIntegrationCard from "./docusign-integration/docusign-integration-card";

type TSearchParams = Promise<{
  error?: string;
  success?: string;
  revoke?: string;
  resource?: string;
}>;

type TParams = Promise<{
  businessId: string;
}>;

export default async function Page({
  params,
  searchParams,
}: {
  params: TParams;
  searchParams: TSearchParams;
}) {
  const { businessId } = await params;
  const { error, success, resource, revoke } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data, error: fetchError } = await supabase
    .from("business_integrations")
    .select()
    .match({ business_id: businessId, status: "active" });

  if (fetchError) throw fetchError;

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <hgroup className="sm:col-span-3 md:col-span-4">
          <h2 className="font-semibold">Integrations</h2>
          <p className="text-sm text-gray-400">
            Integrations can improve your experience with customers. Things like
            DocuSign, Stripe, and more.
          </p>
        </hgroup>
        <div className="grid gap-6 sm:col-span-9 md:col-span-7 md:col-start-6">
          <DocusignIntegrationCard
            businessId={businessId}
            integration={data?.find((i) => i.resource === "docusign")}
            error={error}
            revoke={revoke}
            resource={resource}
            success={success}
          />
        </div>
      </div>
    </div>
  );
}
