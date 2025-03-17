import { Tables } from "@/types/supabase";
import { Button, Card } from "flowbite-react";

export default async function StripeIntegrationCard({
  businessId,
  integration,
}: {
  businessId: string;
  integration?: Tables<"business_integrations">;
}) {
  return (
    <Card>
      <div>
        <h3 className="font-semibold">Stripe</h3>
        <p>Start collecting payments from your customers with Stripe.</p>
      </div>
      {integration ? (
        <div>integrated</div>
      ) : (
        <div className="flex">
          <Button href={`/manage/${businessId}/settings/integrations`}>
            Connect
          </Button>
        </div>
      )}
    </Card>
  );
}
