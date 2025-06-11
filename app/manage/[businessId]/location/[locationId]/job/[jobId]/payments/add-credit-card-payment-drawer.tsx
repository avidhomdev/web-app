"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import {
  initialFormState,
  TInitialFormState,
} from "@/constants/initial-form-state";
import { Tables } from "@/types/supabase";
import {
  Button,
  Drawer,
  DrawerHeader,
  DrawerItems,
  Label,
  TextInput,
} from "flowbite-react";
import { BanknoteIcon } from "lucide-react";
import Form from "next/form";
import { useParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { sendCustomerInvoice } from "./action";

export default function AddCreditCardPaymentDrawer({
  customer,
}: {
  customer?: Tables<"business_location_customers">;
}) {
  const { businessId, locationId, jobId } = useParams();
  const [state, action] = useActionState(
    sendCustomerInvoice<TInitialFormState>,
    {
      ...initialFormState,
      data: {
        name: "Deposit",
        amount: "0",
        return_url: typeof window === "undefined" ? "" : window.location.href,
      },
    },
  );

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (state.success && state.dismiss) {
      setIsOpen(() => false);
      if (state.data.redirect_to_stripe)
        window.location = state.data.redirect_to_stripe;
    }
  }, [state.success, state.dismiss, state.data.redirect_to_stripe, setIsOpen]);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Credit Card</Button>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)} position="right">
        <DrawerHeader
          title="Collect Credit Card Payment"
          titleIcon={() => <BanknoteIcon className="mr-2" />}
        />
        <DrawerItems>
          {state.error && (
            <div className="my-4">
              <ErrorAlert message={state.error} />
            </div>
          )}
          <Form action={action} className="grid gap-4">
            <input type="hidden" name="business_id" value={businessId} />
            <input type="hidden" name="location_id" value={locationId} />
            <input type="hidden" name="job_id" value={jobId} />
            <input
              type="hidden"
              name="full_name"
              value={customer?.full_name ?? ""}
            />
            <input type="hidden" name="email" value={customer?.email ?? ""} />
            <input type="hidden" name="id" value={customer?.id ?? ""} />
            <input
              type="hidden"
              name="stripe_customer_id"
              value={customer?.stripe_customer_id ?? ""}
            />
            <input
              name="return_url"
              type="hidden"
              defaultValue={state.data.return_url}
            />
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Name
              </Label>
              <TextInput
                defaultValue={state.data.name}
                id="name"
                name="name"
                required
              />
            </div>
            <div>
              <Label htmlFor="amount" className="mb-2 block">
                Amount
              </Label>
              <TextInput
                defaultValue={state.data.amount}
                id="amount"
                name="amount"
                type="number"
                required
              />
            </div>
            <SubmitButton pendingText="Sending invoice...">
              Send Invoice
            </SubmitButton>
          </Form>
        </DrawerItems>
      </Drawer>
    </>
  );
}
