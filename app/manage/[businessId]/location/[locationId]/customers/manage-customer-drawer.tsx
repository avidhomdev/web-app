"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import {
  initialFormState,
  TInitialFormState,
} from "@/constants/initial-form-state";
import { useUserContext } from "@/contexts/user";

import { Tables } from "@/types/supabase";
import {
  Drawer,
  DrawerHeader,
  DrawerItems,
  Label,
  Select,
  Textarea,
  TextInput,
  theme,
} from "flowbite-react";
import { UserCogIcon, UserPlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";
import { AddLocationCustomer, UpdateLocationCustomer } from "./actions";

interface IFormData {
  address: string;
  city: string;
  disposition_status: string;
  email: string;
  full_name: string;
  lead_source: string;
  notes: string;
  phone: string;
  postal_code: string;
  state: string;
}

const FormFields = ({ data }: { data: IFormData }) => {
  const { user } = useUserContext();
  const { businessId, locationId } = useParams();
  const { pending } = useFormStatus();

  return (
    <fieldset disabled={pending} className="grid gap-2 md:gap-4 lg:gap-6">
      <input type="hidden" name="profile_id" value={user.id} />
      <input type="hidden" name="location_id" value={locationId} />
      <input type="hidden" name="business_id" value={businessId} />
      <div>
        <Label htmlFor="full_name" className="mb-2 block">
          Full Name
        </Label>
        <TextInput
          autoComplete="off"
          defaultValue={data.full_name}
          id="full_name"
          name="full_name"
          required
          type="full_name"
        />
      </div>
      <div>
        <Label htmlFor="email" className="mb-2 block">
          Email
        </Label>
        <TextInput
          autoComplete="off"
          defaultValue={data.email}
          id="email"
          name="email"
          placeholder="name@example.com"
          type="email"
        />
      </div>
      <div>
        <Label htmlFor="phone" className="mb-2 block">
          Phone
        </Label>
        <TextInput
          autoComplete="off"
          defaultValue={data.phone}
          id="phone"
          name="phone"
          type="phone"
        />
      </div>
      <div>
        <Label htmlFor="address" className="mb-2 block">
          Address
        </Label>
        <TextInput
          autoComplete="off"
          defaultValue={data.address}
          id="address"
          name="address"
        />
      </div>
      <div>
        <Label htmlFor="city" className="mb-2 block">
          City
        </Label>
        <TextInput
          autoComplete="off"
          defaultValue={data.city}
          id="city"
          name="city"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <Label htmlFor="state" className="mb-2 block">
            State
          </Label>
          <TextInput
            autoComplete="off"
            defaultValue={data.state}
            id="state"
            name="state"
          />
        </div>
        <div>
          <Label htmlFor="postal_code" className="mb-2 block">
            Postal Code
          </Label>
          <TextInput
            autoComplete="off"
            defaultValue={data.postal_code}
            id="postal_code"
            name="postal_code"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="disposition_status" className="mb-2 block">
          Status
        </Label>
        <Select
          defaultValue={data.disposition_status}
          id="disposition_status"
          key={data.disposition_status}
          name="disposition_status"
          required
        >
          <option value="">Select a status</option>
          <option value="NEW">New</option>
          <option value="NO_SHOW">No Show</option>
          <option value="CANCELLED_AT_DOOR">Cancelled At Door</option>
          <option value="NO_SALE">No Close</option>
          <option value="PENDING">Pending</option>
          <option value="SOLD">Sold</option>
          <option value="FOLLOW_UP">Follow Up</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="notes" className="mb-2 block">
          Notes
        </Label>
        <Textarea id="notes" name="notes" defaultValue={data.notes} />
      </div>
    </fieldset>
  );
};

type TNewCustomerDrawer = {
  customer?: Tables<"business_location_customers">;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function ManageCustomerDrawer({
  customer,
  isOpen,
  setIsOpen,
}: TNewCustomerDrawer) {
  const router = useRouter();
  const handleClose = () => setIsOpen(false);
  const [state, action] = useActionState(
    customer
      ? UpdateLocationCustomer<TInitialFormState>
      : AddLocationCustomer<TInitialFormState>,
    {
      ...initialFormState,
      data: {
        address: customer?.address ?? "",
        city: customer?.city ?? "",
        disposition_status: customer?.disposition_status ?? "NEW",
        email: customer?.email ?? "",
        full_name: customer?.full_name ?? "",
        lead_source: customer?.lead_source ?? "setter",
        notes: customer?.notes ?? "",
        phone: customer?.phone ?? "",
        postal_code: customer?.postal_code ?? "",
        state: customer?.state ?? "",
      },
    },
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      if (state.dismiss) setIsOpen(() => false);
    }
  }, [state.success, state.dismiss, router, setIsOpen]);

  return (
    <Drawer
      open={isOpen}
      onClose={handleClose}
      position="right"
      theme={{
        root: {
          position: {
            right: { on: twMerge(theme.drawer.root.position.right.on, "w-96") },
          },
        },
      }}
    >
      <DrawerHeader
        title={`${customer ? "Update" : "Add"} Customer`}
        titleIcon={() =>
          customer ? (
            <UserCogIcon className="mr-2" />
          ) : (
            <UserPlusIcon className="mr-2" />
          )
        }
      />
      <DrawerItems>
        {state.error && (
          <div className="my-4">
            <ErrorAlert message={state.error} />
          </div>
        )}
        <form action={action}>
          {customer && <input name="id" type="hidden" value={customer.id} />}
          <FormFields data={state.data} />
          <div className="mt-4">
            <SubmitButton
              pendingText={`${customer ? "Updating" : "Creating"} customer...`}
            >
              {customer ? (
                <UserCogIcon className="mr-2" />
              ) : (
                <UserPlusIcon className="mr-2" />
              )}
              {`${customer ? "Update" : "Add"} Customer`}
            </SubmitButton>
          </div>
        </form>
      </DrawerItems>
    </Drawer>
  );
}
