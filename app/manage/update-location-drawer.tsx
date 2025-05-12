"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { US_STATES } from "@/constants/us-states";
import { Tables } from "@/types/supabase";
import { Drawer, DrawerHeader, DrawerItems, Label, Select, TextInput } from "flowbite-react";
import { MapPinIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { UpdateBusinessLocation } from "./actions";

const FormFields = ({
  defaultValues,
}: {
  defaultValues: Tables<"business_locations">;
}) => {
  const { pending } = useFormStatus();

  return (
    <fieldset disabled={pending} className="grid gap-2 md:gap-4 lg:gap-6">
      <input type="hidden" name="id" value={defaultValues.id} />
      <div>
        <Label htmlFor="name" className="mb-2 block">
          Name
        </Label>
        <TextInput
          id="name"
          name="name"
          placeholder="Southern Utah"
          required
          defaultValue={defaultValues.name}
        />
      </div>
      <h4 className="border-b text-lg font-medium">Office</h4>
      <div>
        <Label htmlFor="address" className="mb-2 block">
          Address
        </Label>
        <TextInput
          id="address"
          name="address"
          placeholder="1234 Apple Street"
          defaultValue={defaultValues.address ?? ""}
        />
      </div>
      <div>
        <Label htmlFor="address2" className="mb-2 block">
          Address 2
        </Label>
        <TextInput
          id="address2"
          name="address2"
          placeholder="Suite 2"
          defaultValue={defaultValues.address2 ?? ""}
        />
      </div>
      <div>
        <Label htmlFor="city" className="mb-2 block">
          City
        </Label>
        <TextInput
          id="city"
          name="city"
          placeholder="Sydney"
          defaultValue={defaultValues.city ?? ""}
        />
      </div>
      <div>
        <Label htmlFor="state" className="mb-2 block">
          State
        </Label>
        <Select name="state" defaultValue={defaultValues.state ?? ""}>
          <option value="">Select a state</option>
          {Object.entries(US_STATES).map(([abbr, name]) => (
            <option key={abbr} value={abbr}>
              {name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="postal_code" className="mb-2 block">
          Postal Code
        </Label>
        <TextInput
          id="postal_code"
          name="postal_code"
          placeholder="02321-2342"
          defaultValue={defaultValues.postal_code ?? ""}
        />
      </div>
      <SubmitButton pendingText="Saving location">
        <MapPinIcon className="mr-2" />
        Update location
      </SubmitButton>
    </fieldset>
  );
};

type UpdateLocationDrawerType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  location: Tables<"business_locations">;
};

export default function UpdateLocationDrawer({
  isOpen,
  setIsOpen,
  location,
}: UpdateLocationDrawerType) {
  const router = useRouter();
  const handleClose = () => setIsOpen(false);
  const [state, action] = useActionState(
    UpdateBusinessLocation<TInitialFormState>,
    initialFormState,
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      if (state.dismiss) setIsOpen(() => false);
    }
  }, [state.success, state.dismiss, router, setIsOpen]);

  return (
    <Drawer open={isOpen} onClose={handleClose} position="right">
      <DrawerHeader
        title="Edit Location"
        titleIcon={() => <MapPinIcon className="mr-2" />}
      />
      <DrawerItems>
        {state.error && (
          <div className="my-4">
            <ErrorAlert message={state.error} />
          </div>
        )}
        <form action={action}>
          <FormFields defaultValues={location} />
        </form>
      </DrawerItems>
    </Drawer>
  );
}
