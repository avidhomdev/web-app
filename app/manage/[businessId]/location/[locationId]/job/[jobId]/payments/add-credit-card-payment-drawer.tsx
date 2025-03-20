"use client";

import SubmitButton from "@/components/submit-button";
import { Tables } from "@/types/supabase";
import { Button, Drawer, Label, TextInput } from "flowbite-react";
import { CreditCard } from "lucide-react";
import Form from "next/form";
import { useParams } from "next/navigation";
import { useState } from "react";
import { redirectToStripeCheckout } from "./action";

export default function AddCreditCardPaymentDrawer({
  customer,
}: {
  customer: Tables<"business_location_customers">;
}) {
  const { jobId } = useParams();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Credit Card</Button>

      <Drawer open={isOpen} onClose={() => setIsOpen(false)} position="right">
        <Drawer.Header
          title="Collect Credit Card Payment"
          titleIcon={() => <CreditCard className="mr-2" />}
        />
        <Drawer.Items>
          <Form action={redirectToStripeCheckout} className="grid gap-4">
            <input name="jobId" type="hidden" value={jobId} />
            <input name="email" type="hidden" value={customer.email!} />
            <input
              name="return_url"
              type="hidden"
              defaultValue={
                typeof window === "undefined" ? "" : window.location.href
              }
            />
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Name
              </Label>
              <TextInput
                defaultValue="Deposit"
                id="name"
                name="name"
                required
              />
            </div>
            <div>
              <Label htmlFor="amount" className="mb-2 block">
                Amount
              </Label>
              <TextInput id="amount" name="amount" type="number" required />
            </div>
            <SubmitButton pendingText="Starting checkout...">
              Checkout
            </SubmitButton>
          </Form>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
