"use client";

import SubmitButton from "@/components/submit-button";
import { Button, Datepicker, Drawer, Label, TextInput } from "flowbite-react";
import { CreditCard } from "lucide-react";
import Form from "next/form";
import { useState } from "react";

export default function AddCreditCardPaymentDrawer() {
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
          <Form action={() => {}} className="grid gap-4">
            <div>
              <Label htmlFor="date" className="mb-2 block">
                Date
              </Label>
              <Datepicker id="date" name="date" required />
            </div>
            <div>
              <Label htmlFor="amount" className="mb-2 block">
                Amount
              </Label>
              <TextInput id="amount" name="amount" type="number" required />
            </div>
            <SubmitButton pendingText="Creating transaction...">
              Submit
            </SubmitButton>
          </Form>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
