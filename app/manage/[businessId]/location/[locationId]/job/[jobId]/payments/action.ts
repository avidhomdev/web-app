"use server";

import { jsonToFormUrlEncoded } from "@/utils/json-to-form-url-encoded";
import { redirect } from "next/navigation";

export async function redirectToStripeCheckout(formData: FormData) {
  const fields = Object.fromEntries(formData);

  const checkoutParams = {
    customer_email: fields.email as string,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            description: "One time transaction",
            name: fields.name as string,
          },
          unit_amount: Number(fields.amount) * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      job_id: fields.jobId as string,
      customer_email: fields.email as string,
    },
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${fields.return_url as string}?success=Checkout session created.`,
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

  if (stripeResponse.url) redirect(stripeResponse.url);
  return;
}
