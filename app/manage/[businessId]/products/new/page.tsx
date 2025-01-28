"use client";

import ErrorAlert from "@/components/error-alert";
import PageHeaderWithActions from "@/components/page-header-with-actions";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { useBusinessContext } from "@/contexts/business";
import {
  Breadcrumb,
  Card,
  Label,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { BoxIcon, ChevronLeftIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AddProduct } from "./actions";

function FormFields({
  defaultValues,
}: {
  defaultValues: {
    name: string;
    unit: string;
    unit_price: string;
    lead_price: string;
    units_in_stock: string;
  };
}) {
  const { businessId } = useParams();
  const { pending } = useFormStatus();
  const { business } = useBusinessContext();
  const [enabledLocations, setEnabledLocations] = useState<number[]>([]);

  const toggleLocation = (location: number) => () =>
    setEnabledLocations((prevState) =>
      prevState.includes(location)
        ? prevState.filter((l) => l !== location)
        : [...prevState, location],
    );

  return (
    <>
      <Card>
        <h2 className="text-xl font-medium text-gray-400">
          Product Information
        </h2>
        <fieldset
          disabled={pending}
          className="grid gap-2 pb-2 sm:grid-cols-2 md:gap-6 md:pb-6"
        >
          <input type="hidden" name="business_id" value={businessId} />
          <div className="sm:col-span-2">
            <Label htmlFor="name" className="mb-2 block">
              Name
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={defaultValues.name}
              id="name"
              name="name"
              placeholder="Premium Turf"
              required
            />
          </div>
          <div>
            <Label htmlFor="unit" className="mb-2 block">
              Unit
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={defaultValues.unit}
              id="unit"
              name="unit"
              placeholder="sq ft"
              required
            />
          </div>
          <div>
            <Label htmlFor="unit_price" className="mb-2 block">
              Unit Price
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={defaultValues.unit_price}
              id="unit_price"
              name="unit_price"
              placeholder="10.00"
              required
            />
          </div>
          <div>
            <Label htmlFor="lead_price" className="mb-2 block">
              Lead Price
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={defaultValues.lead_price}
              helperText={
                <>
                  Pricing applied to products when job has certain lead types
                  selected.
                </>
              }
              id="lead_price"
              name="lead_price"
              placeholder="1.00"
            />
          </div>
        </fieldset>
      </Card>
      <Card>
        <h2 className="text-xl font-medium text-gray-400">
          Inventory Information
        </h2>
        <fieldset
          disabled={pending}
          className="grid gap-2 pb-2 sm:grid-cols-2 md:gap-6 md:pb-6"
        >
          <div>
            <Label htmlFor="units_in_stock" className="mb-2 block">
              In Stock Units
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={defaultValues.units_in_stock}
              id="units_in_stock"
              name="units_in_stock"
              placeholder="10000"
            />
          </div>
        </fieldset>
      </Card>
      <Card>
        <h2 className="text-xl font-medium text-gray-400">Locations</h2>
        <fieldset
          disabled={pending}
          className="grid gap-2 pb-2 sm:grid-cols-2 md:gap-6 md:pb-6"
        >
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
        </fieldset>
      </Card>
    </>
  );
}

export default function Page() {
  const { businessId } = useParams();
  const [state, action] = useActionState(AddProduct<TInitialFormState>, {
    ...initialFormState,
    data: {
      name: "",
      unit: "",
      unit_price: "",
      lead_price: "",
      units_in_stock: "",
    },
  });

  return (
    <div className="mx-auto grid w-full max-w-screen-md gap-4">
      <PageHeaderWithActions
        title="New Product"
        renderBreadcrumbs={() => (
          <Breadcrumb aria-label="Back to products">
            <Breadcrumb.Item
              href={`/manage/${businessId}/products`}
              icon={() => <ChevronLeftIcon className="mr-2" />}
            >
              Back to products
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
      />
      {state.error && <ErrorAlert message={state.error} />}
      <form action={action} className="grid gap-4 sm:gap-6">
        <FormFields defaultValues={state.data} />
        <div>
          <SubmitButton pendingText="Creating product">
            <BoxIcon className="mr-2" />
            Create Product
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
