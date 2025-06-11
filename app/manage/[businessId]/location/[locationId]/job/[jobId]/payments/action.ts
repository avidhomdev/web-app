"use server";

import JobInvoiceEmailTemplate from "@/components/emails/job-invoice";
import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { jsonToFormUrlEncoded } from "@/utils/json-to-form-url-encoded";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export async function collectManualPayment<T>(
  ...args: ServerActionWithState<T>
) {
  const [prevState, formData] = args;
  const supabase = await createSupabaseServerClient();
  const data = Object.fromEntries(formData);

  if (Number(data.amount) <= 0) {
    return formStateResponse({
      ...prevState,
      data,
      error: "Amount must be greater than 0",
    });
  }

  const insertParams = {
    business_id: data.business_id as string,
    location_id: Number(data.location_id),
    job_id: Number(data.job_id),
    name: data.name as string,
    type: data.type as string,
    amount: Number(data.amount),
  };

  const { error } = await supabase
    .from("business_location_job_payments")
    .insert(insertParams);

  if (error) {
    return formStateResponse({
      ...prevState,
      data,
      success: false,
      error: error.message,
    });
  }

  return formStateResponse({
    ...prevState,
    data,
    success: true,
    dismiss: true,
  });
}

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

export async function sendCustomerInvoice<T>(
  ...args: ServerActionWithState<T>
) {
  const supabase = await createSupabaseServerClient();
  const [prevState, formData] = args;
  const data = Object.fromEntries(formData);
  const newState = {
    ...prevState,
    data,
  };

  if (Number(data.amount) <= 0) {
    return formStateResponse({
      ...prevState,
      data,
      error: "Amount must be greater than 0",
    });
  }

  if (!data.stripe_customer_id && !data.email) {
    return formStateResponse({
      ...newState,
      error: "Missing customer information.",
    });
  }

  const stripeCustomerId =
    data.stripe_customer_id ||
    (await findOrCreateStripeCustomer({
      customerId: Number(data.id),
      email: data.email as string,
    }));

  const stripeResponse = await createInvoiceWithLineItems({
    customer: stripeCustomerId,
    job_id: data.job_id as string,
    lines: [
      {
        amount: Number(data.amount) * 100,
        description: data.name as string,
      },
    ],
  });

  const insertParams = {
    business_id: data.business_id as string,
    location_id: Number(data.location_id),
    job_id: Number(data.job_id),
    name: data.name as string,
    type: "invoice",
    amount: Number(data.amount),
    stripe_invoice_id: stripeResponse.id,
  };

  const { error } = await supabase
    .from("business_location_job_payments")
    .insert(insertParams);

  if (error) {
    return formStateResponse({
      ...prevState,
      data,
      success: false,
      error: error.message,
    });
  }

  revalidatePath(
    `/manage/${data.business_id}/location/${data.location_id}/job/${data.job_id}/payments`,
  );

  await resend.emails.send({
    from: "no-reply <no-reply@avid-hom.com>",
    to: [data.email as string],
    subject: "New Invoice",
    react: JobInvoiceEmailTemplate({
      name: data.full_name as string,
      invoice_url: stripeResponse.hosted_invoice_url,
    }),
  });

  return formStateResponse({
    ...prevState,
    data,
    success: true,
    dismiss: true,
  });
}

export async function collectCreditCardPayment<T>(
  ...args: ServerActionWithState<T>
) {
  const [prevState, formData] = args;
  const supabase = await createSupabaseServerClient();
  const data = Object.fromEntries(formData);

  if (Number(data.amount) <= 0) {
    return formStateResponse({
      ...prevState,
      data,
      error: "Amount must be greater than 0",
    });
  }

  const checkoutParams = {
    customer_email: data.email as string,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            description: "One time transaction",
            name: data.name as string,
          },
          unit_amount: Number(data.amount) * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      job_id: data.jobId as string,
      customer_email: data.email as string,
    },
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${data.return_url as string}?success=Checkout session created.`,
    ui_mode: "hosted",
  };

  const stripeResponse = await fetch(
    `${process.env.NEXT_PUBLIC_STRIPE_API_URL}/checkout/sessions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: jsonToFormUrlEncoded(checkoutParams),
    },
  ).then((res) => res.json());

  if (stripeResponse.error) {
    return formStateResponse({
      ...prevState,
      data,
      success: false,
      error: stripeResponse.error.message,
    });
  }

  const insertParams = {
    business_id: data.business_id as string,
    location_id: Number(data.location_id),
    job_id: Number(data.job_id),
    name: data.name as string,
    type: "card",
    amount: Number(data.amount),
    stripe_checkout_session_id: stripeResponse.id,
  };

  const { error } = await supabase
    .from("business_location_job_payments")
    .insert(insertParams);

  if (error) {
    return formStateResponse({
      ...prevState,
      data,
      success: false,
      error: error.message,
    });
  }

  revalidatePath(
    `/manage/${data.business_id}/location/${data.location_id}/job/${data.job_id}/payments`,
  );

  return formStateResponse({
    ...prevState,
    data: {
      ...data,
      redirect_to_stripe: stripeResponse.url,
    },
    success: true,
    dismiss: true,
  });
}
