"use client";

import ErrorAlert from "@/components/error-alert";
import PageHeaderWithActions from "@/components/page-header-with-actions";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { Breadcrumb, Card, Label, Select, TextInput } from "flowbite-react";
import { BoxIcon, ChevronLeftIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AddLocation } from "./actions";
import { US_STATES } from "@/constants/us-states";

function FormFields() {
  const { businessId } = useParams();
  const { pending } = useFormStatus();
  return (
    <>
      <Card>
        <h2 className="text-xl font-medium text-gray-400">
          Location Information
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
              id="name"
              name="name"
              placeholder="Los Angeles"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address" className="mb-2 block">
              Address
            </Label>
            <TextInput
              autoComplete="off"
              id="address"
              name="address"
              placeholder="1234 North St"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address2" className="mb-2 block">
              Address 2
            </Label>
            <TextInput
              autoComplete="off"
              id="address2"
              name="address2"
              placeholder="Suite 33"
            />
          </div>
          <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2 md:gap-6">
            <div>
              <Label htmlFor="city" className="mb-2 block">
                City
              </Label>
              <TextInput
                autoComplete="off"
                id="city"
                name="city"
                placeholder="Los Angeles"
                required
              />
            </div>
            <div>
              <Label htmlFor="state" className="mb-2 block">
                State
              </Label>
              <Select name="state" id="state" required>
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
                autoComplete="off"
                id="postal_code"
                name="postal_code"
                placeholder="90650"
                required
              />
            </div>
          </div>
        </fieldset>
      </Card>
    </>
  );
}

export default function Page() {
  const { businessId } = useParams();
  const [state, action] = useActionState(
    AddLocation<TInitialFormState>,
    initialFormState,
  );
  return (
    <div className="container relative flex max-w-screen-md flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <PageHeaderWithActions
        title="New Location"
        renderBreadcrumbs={() => (
          <Breadcrumb aria-label="Back to locations">
            <Breadcrumb.Item
              href={`/manage/${businessId}/locations`}
              icon={() => <ChevronLeftIcon className="mr-2" />}
            >
              Back to locations
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
      />
      {state.error && <ErrorAlert message={state.error} />}
      <form action={action} className="grid gap-4 sm:gap-6">
        <FormFields />
        <div>
          <SubmitButton pendingText="Creating Location...">
            <BoxIcon className="mr-2" />
            Create Location
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
