"use server";

import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { jsonToFormUrlEncoded } from "@/utils/json-to-form-url-encoded";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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
