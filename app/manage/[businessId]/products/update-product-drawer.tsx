"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import {
  initialFormState,
  TInitialFormState,
} from "@/constants/initial-form-state";
import { useBusinessContext } from "@/contexts/business";
import { useUserContext } from "@/contexts/user";
import { Drawer, DrawerHeader, DrawerItems, Label, TextInput, ToggleSwitch } from "flowbite-react";
import { UserPlus2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useFormStatus } from "react-dom";
import { UpdateProduct } from "./actions";
import { IBusinessProductWithLocation } from "./page";

const FormFields = ({
  defaultValues,
}: {
  defaultValues: IBusinessProductWithLocation;
}) => {
  const { business } = useBusinessContext();
  const { pending } = useFormStatus();
  const { user } = useUserContext();
  const [enabledLocations, setEnabledLocations] = useState<number[]>(
    defaultValues.locations.flatMap((location) =>
      location.status === 1 ? Number(location.location_id) : [],
    ),
  );

  const toggleLocation = (location: number) => () =>
    setEnabledLocations((prevState) =>
      prevState.includes(location)
        ? prevState.filter((l) => l !== location)
        : [...prevState, location],
    );

  return (
    <fieldset disabled={pending} className="grid gap-2 lg:gap-6">
      <input type="hidden" name="id" value={defaultValues.id} />
      <input type="hidden" name="profile_id" value={user.id} />
      <input
        type="hidden"
        name="business_id"
        value={defaultValues.business_id}
      />
      <div>
        <Label htmlFor="name" className="mb-2 block">
          Name
        </Label>
        <TextInput
          defaultValue={defaultValues.name ?? ""}
          id="name"
          name="name"
        />
      </div>
      <div>
        <Label htmlFor="unit" className="mb-2 block">
          Unit
        </Label>
        <TextInput
          defaultValue={defaultValues.unit ?? ""}
          id="unit"
          name="unit"
        />
      </div>
      <div>
        <Label htmlFor="unit_price" className="mb-2 block">
          Unit Price
        </Label>
        <TextInput
          id="unit_price"
          name="unit_price"
          defaultValue={defaultValues.unit_price ?? ""}
        />
      </div>
      <div>
        <Label htmlFor="lead_price" className="mb-2 block">
          Lead Price
        </Label>
        <TextInput
          id="lead_price"
          name="lead_price"
          defaultValue={defaultValues.lead_price ?? ""}
        />
      </div>
      <div>
        <Label htmlFor="units_in_stock" className="mb-2 block">
          In Stock Units
        </Label>
        <TextInput
          id="units_in_stock"
          name="units_in_stock"
          defaultValue={defaultValues.units_in_stock ?? ""}
        />
      </div>
      <div>
        <Label htmlFor="units_in_stock" className="mb-2 block">
          Minimum Units
        </Label>
        <TextInput
          id="min_units"
          name="min_units"
          defaultValue={defaultValues.min_units ?? ""}
        />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-medium text-gray-400">Locations</h2>
        {business.locations.map((location) => (
          <div className="flex items-center gap-2" key={location.id}>
            <ToggleSwitch
              checked={enabledLocations.includes(Number(location.id))}
              onChange={toggleLocation(Number(location.id))}
              id={`location__${location.id}`}
              label={location.name}
            />
            <input
              name={`location__${location.id}__status`}
              type="hidden"
              value={enabledLocations.includes(Number(location.id)) ? 1 : 0}
            />
          </div>
        ))}
      </div>

      <SubmitButton pendingText="Updating product">
        <UserPlus2Icon className="mr-2" />
        Update Product
      </SubmitButton>
    </fieldset>
  );
};

type TUpdateProductDrawer = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  product: IBusinessProductWithLocation;
};

export default function UpdateProductDrawer({
  isOpen,
  setIsOpen,
  product,
}: TUpdateProductDrawer) {
  const router = useRouter();
  const handleClose = () => setIsOpen(false);
  const [state, action] = useActionState(
    UpdateProduct<TInitialFormState>,
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
        title="Update product"
        titleIcon={() => <UserPlus2Icon className="mr-2" />}
      />
      <DrawerItems>
        {state.error && (
          <div className="my-4">
            <ErrorAlert message={state.error} />
          </div>
        )}
        <form action={action} className="my-4">
          <FormFields defaultValues={product} />
        </form>
      </DrawerItems>
    </Drawer>
  );
}
