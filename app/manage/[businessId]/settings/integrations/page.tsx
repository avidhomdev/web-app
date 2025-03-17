import ErrorAlert from "@/components/error-alert";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { Alert } from "flowbite-react";
import DocusignIntegrationCard from "./docusign-integration/docusign-integration-card";
import StripeIntegrationCard from "./stripe-integration/stripe-integration-card";

type TSearchParams = Promise<{
  error?: string;
  success?: string;
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
  const { error, success } = await searchParams;
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
          {error && <ErrorAlert message={error} />}
          {success && (
            <Alert color="success">
              <strong className="font-semibold">Success!</strong> {success}
            </Alert>
          )}
          <DocusignIntegrationCard
            businessId={businessId}
            integration={data?.find((i) => i.resource === "docusign")}
          />
          <StripeIntegrationCard
            businessId={businessId}
            integration={data?.find((i) => i.resource === "stripe")}
          />
        </div>
      </div>
    </div>
  );
}
