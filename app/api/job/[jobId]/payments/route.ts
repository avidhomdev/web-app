import { routeHandlerWithJwtSupabaseAuth } from "@/utils/route-handler-with-jwt-supabase-auth";
import { NextResponse } from "next/server";

interface StripeInvoice {
  hosted_invoice_url?: string;
  id: string;
  status: string;
  status_transitions: {
    paid_at: number;
  };
}

async function getJobStripeInvoices(
  jobId: string,
): Promise<Record<string, StripeInvoice>> {
  const { data = [] }: { data: StripeInvoice[] } = await fetch(
    `${process.env.NEXT_PUBLIC_STRIPE_API_URL}/invoices/search?query=metadata['job_id']:'${jobId}'`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
    .then((res) => res.json())
    .catch(() => {
      return [];
    });

  const dictionary = data.reduce<Record<string, StripeInvoice>>(
    (acc, invoice) => {
      acc[invoice.id] = invoice;
      return acc;
    },
    {},
  );

  return dictionary;
}

export const GET = routeHandlerWithJwtSupabaseAuth(async (request, context) => {
  const { params, supabase } = context;
  const { jobId } = await params;

  const { data: payments, error: paymentsError } = await supabase
    .from("business_location_job_payments")
    .select("*")
    .eq("job_id", Number(jobId))
    .order("created_at", { ascending: false });

  if (paymentsError) {
    return NextResponse.json(
      { success: false, error: paymentsError.message },
      { status: 400 },
    );
  }

  const paymentReceiptDictionary = await supabase.storage
    .from("business")
    .createSignedUrls(
      payments.flatMap((payment) => payment.photo || []),
      3600,
    )
    .then(({ data, error }) => {
      if (!data || error) return {};

      return data.reduce<Record<string, string>>((acc, item) => {
        if (item.path) acc[item.path] = item.signedUrl;
        return acc;
      }, {});
    });

  const stripeInvoiceDictionary = await getJobStripeInvoices(jobId);

  const paymentsWithAdditionalData = payments.map((payment) => {
    const stripeInvoice = payment.stripe_invoice_id
      ? stripeInvoiceDictionary[payment.stripe_invoice_id]
      : null;
    const signedUrl = payment.photo
      ? paymentReceiptDictionary[payment.photo]
      : null;

    return {
      ...payment,
      stripeInvoice,
      receipt_url: stripeInvoice?.hosted_invoice_url || signedUrl,
    };
  });

  return NextResponse.json(
    { success: true, data: paymentsWithAdditionalData, error: null },
    { status: 200 },
  );
});
