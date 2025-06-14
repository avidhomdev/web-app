"use client";

import SubmitButton from "@/components/submit-button";
import {
  Button,
  Drawer,
  DrawerHeader,
  DrawerItems,
  Label,
  Select,
  TextInput,
} from "flowbite-react";
import { BanknoteIcon } from "lucide-react";
import Form from "next/form";
import { useParams, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { collectManualPayment } from "./action";
import {
  initialFormState,
  TInitialFormState,
} from "@/constants/initial-form-state";
import ErrorAlert from "@/components/error-alert";
import SupabaseFileUploadDropzone from "@/components/supabase-file-upload-dropzone";

export default function AddManualPaymentDrawer() {
  const router = useRouter();
  const { businessId, locationId, jobId } = useParams();
  const [state, action] = useActionState(
    collectManualPayment<TInitialFormState>,
    {
      ...initialFormState,
      data: {
        type: "",
        name: "Deposit",
        amount: "0",
      },
    },
  );

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (state.success && state.dismiss) {
      setIsOpen(() => false);
      router.refresh();
    }
  }, [state.success, state.dismiss, setIsOpen, router]);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Cash or Check</Button>
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
            <div>
              <Label htmlFor="type" className="mb-2 block">
                Type
              </Label>
              <Select
                defaultValue={state.data.type}
                key={state.data.type}
                id="type"
                name="type"
                required
              >
                <option value="">Select a option</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
              </Select>
            </div>
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
            <SupabaseFileUploadDropzone
              bucket="business"
              defaultPath={state.data.photo}
              filePath={`${businessId}/locations/${locationId}/jobs/${jobId}/payments`}
              name="photo"
            />
            <SubmitButton pendingText="Saving payment...">Save</SubmitButton>
          </Form>
        </DrawerItems>
      </Drawer>
    </>
  );
}
