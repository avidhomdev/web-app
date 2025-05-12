"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { US_STATES } from "@/constants/us-states";
import { useUserContext } from "@/contexts/user";
import { Drawer, DrawerHeader, DrawerItems, Label, Select, TextInput } from "flowbite-react";
import { MapPinIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useCallback,
  useEffect,
} from "react";
import { AddBusinessLocation } from "./actions";

export default function NewLocationDrawer({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { businessId } = useParams();
  const { user } = useUserContext();
  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);
  const [state, action] = useActionState(
    AddBusinessLocation<TInitialFormState>,
    initialFormState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.data) {
      router.refresh();
      if (state.dismiss) handleClose();
    }
  }, [state.success, state.dismiss, router, handleClose, state.data]);

  return (
    <Drawer open={isOpen} onClose={handleClose} position="right">
      <DrawerHeader
        title="New Location"
        titleIcon={() => <MapPinIcon className="mr-2" />}
      />
      <DrawerItems>
        {state?.error && (
          <div className="my-4">
            <ErrorAlert message={state.error} />
          </div>
        )}
        <form action={action} className="grid gap-2 md:gap-4 lg:gap-6">
          <input type="hidden" name="business_id" value={businessId} />
          <input type="hidden" name="profile_id" value={user.id} />
          <div>
            <Label htmlFor="name" className="mb-2 block">
              Name
            </Label>
            <TextInput
              id="name"
              name="name"
              placeholder="Southern Utah"
              required
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
            />
          </div>
          <div>
            <Label htmlFor="address2" className="mb-2 block">
              Address 2
            </Label>
            <TextInput id="address2" name="address2" placeholder="Suite 300" />
          </div>
          <div>
            <Label htmlFor="city" className="mb-2 block">
              City
            </Label>
            <TextInput id="city" name="city" placeholder="Sydney" />
          </div>
          <div>
            <Label htmlFor="state" className="mb-2 block">
              State
            </Label>
            <Select name="state">
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
            />
          </div>
          <SubmitButton>
            <MapPinIcon className="mr-2" />
            Create location
          </SubmitButton>
        </form>
      </DrawerItems>
    </Drawer>
  );
}
