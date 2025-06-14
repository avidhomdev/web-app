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
import { BanknoteIcon, SettingsIcon } from "lucide-react";
import Form from "next/form";
import { useParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { updatePayment } from "./action";

export default function UpdatePaymentDrawer({
  payment,
}: {
  payment: Tables<"business_location_job_payments">;
}) {
  const { businessId, locationId, jobId } = useParams();
  const [state, action] = useActionState(updatePayment<TInitialFormState>, {
    ...initialFormState,
    data: {
      received_on: payment?.received_on,
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (state.success && state.dismiss) setIsOpen(() => false);
  }, [state.success, state.dismiss, setIsOpen]);

  return (
    <>
      <Button
        className="cursor-pointer"
        color="alternative"
        onClick={() => setIsOpen(true)}
        size="sm"
      >
        <SettingsIcon />
      </Button>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)} position="right">
        <DrawerHeader
          title="Collect Manual Payment"
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
            <input type="hidden" name="id" value={payment.id} />
            <div>
              <Label htmlFor="received_on" className="mb-2 block">
                Date Received
              </Label>
              <TextInput
                id="received_on"
                name="received_on"
                type="date"
                required
                defaultValue={state.data.received_on}
                className="w-full"
                placeholder="Select date"
              />
            </div>

            <SubmitButton pendingText="Saving...">Save</SubmitButton>
          </Form>
        </DrawerItems>
      </Drawer>
    </>
  );
}
