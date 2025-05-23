import JobInvoiceEmailTemplate from "@/components/emails/job-invoice";
import { jsonToFormUrlEncoded } from "@/utils/json-to-form-url-encoded";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

async function findOrCreateStripeCustomer({
  customerId,
  email,
}: {
  customerId: number;
  email: string;
}) {
  const supabase = await createSupabaseServerClient();

  return fetch(
    `${process.env.NEXT_PUBLIC_STRIPE_API_URL}/customers?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
    .then((res) => res.json())
    .then(async ({ data: customers }) => {
      if (customers.length > 0) {
        await supabase
          .from("business_location_customers")
          .update({ stripe_customer_id: customers[0].id })
          .eq("id", customerId);
        return customers[0].id;
      }

      return fetch(`${process.env.NEXT_PUBLIC_STRIPE_API_URL}/customers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: jsonToFormUrlEncoded({ email }),
      })
        .then((res) => res.json())
        .then(async (customer) => {
          await supabase
            .from("business_location_customers")
            .update({ stripe_customer_id: customer.id })
            .eq("id", customerId);
          return customer.id;
        });
    });
}

async function createInvoiceWithLineItems({
  customer,
  job_id,
  lines,
}: {
  customer: string;
  job_id: string;
  lines: { amount: number; description: string }[];
}) {
  return fetch(`${process.env.NEXT_PUBLIC_STRIPE_API_URL}/invoices`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: jsonToFormUrlEncoded({
      customer,
      collection_method: "send_invoice",
      due_date: dayjs().add(1, "day").unix(),
      metadata: {
        job_id,
      },
    }),
  })
    .then((res) => res.json())
    .then(({ id, error }) => {
      if (error) throw new Error(error.message);

      return id;
    })
    .then((invoiceId) =>
      fetch(
        `${process.env.NEXT_PUBLIC_STRIPE_API_URL}/invoices/${invoiceId}/add_lines`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: jsonToFormUrlEncoded({
            lines,
          }),
        },
      ),
    )
    .then((res) => res.json())
    .then(({ id, error }) => {
      if (error) throw new Error(error.message);

      return fetch(
        `${process.env.NEXT_PUBLIC_STRIPE_API_URL}/invoices/${id}/finalize`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
    })
    .then((res) => res.json());
}

const resend = new Resend(process.env.RESEND_API_KEY);
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Replace with specific origin in production
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> },
) {
  const { customerId } = await params;
  const headersList = await request.headers;

  const authHeader = headersList.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid Authorization header" },
      { headers: corsHeaders, status: 401 },
    );
  }
  const jwt = authHeader.split(" ")[1];

  const supabase = await createSupabaseServerClient({ jwt });
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(jwt);

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { headers: corsHeaders, status: 401 },
    );
  }

  const body = await request.json();

  const { data: customer, error: customerError } = await supabase
    .from("business_location_customers")
    .select("*")
    .eq("id", Number(customerId))
    .maybeSingle();

  if (!customer || customerError) {
    return NextResponse.json(
      { success: false, error: "Missing customer information" },
      { headers: corsHeaders, status: 400 },
    );
  }

  const stripeCustomerId =
    customer.stripe_customer_id ||
    (await findOrCreateStripeCustomer({
      customerId: Number(customer.id),
      email: customer.email,
    }));

  const stripeResponse = await createInvoiceWithLineItems({
    customer: stripeCustomerId,
    job_id: body.job_id as string,
    lines: [
      {
        amount: Number(body.amount) * 100,
        description: body.name as string,
      },
    ],
  });

  if (stripeResponse.error) {
    return NextResponse.json(
      { success: false, error: stripeResponse.error.message },
      { headers: corsHeaders, status: 400 },
    );
  }

  await resend.emails.send({
    from: "no-reply <no-reply@avid-hom.com>",
    to: [customer.email as string],
    subject: "New Invoice",
    react: JobInvoiceEmailTemplate({
      name: customer.full_name as string,
      invoice_url: stripeResponse.hosted_invoice_url,
    }),
  });

  return NextResponse.json({ success: true }, { headers: corsHeaders });
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: corsHeaders,
    },
  );
}
