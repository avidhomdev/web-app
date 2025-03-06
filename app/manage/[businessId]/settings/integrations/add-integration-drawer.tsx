"use client";

import FormDrawer from "@/components/form-drawer";
import SubmitButton from "@/components/submit-button";
import { Button, Label, Radio } from "flowbite-react";
import { BoxIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { AddIntegration } from "./actions";

export function AddIntegrationDrawer() {
  const { businessId } = useParams();

  const integrations = [
    {
      description: "Securely sign documents electronically.",
      disabled: false,
      name: "DocuSign",
      resource: "docusign",
    },
    {
      description: "Accept payments and manage subscriptions.",
      disabled: true,
      name: "Stripe",
      resource: "stripe",
    },
    {
      description: "Video conferencing, webinars and chat with customers.",
      disabled: true,
      name: "Zoom",
      resource: "zoom",
    },
  ];

  return (
    <FormDrawer
      FormAction={AddIntegration}
      renderTrigger={(toggle) => (
        <Button onClick={toggle}>Add Integration</Button>
      )}
      title="Add Integration"
      titleIcon={() => <BoxIcon className="mr-2" />}
    >
      <div className="grid gap-6">
        <input type="hidden" name="business_id" value={businessId} />
        <fieldset className="grid gap-2">
          <Label>Start by selecting a resource to integrate with.</Label>

          {integrations.map(({ description, disabled, name, resource }) => (
            <div key={resource}>
              <Radio
                className="peer hidden"
                disabled={disabled}
                id={resource}
                name="resource"
                value={resource}
              />
              <Label
                htmlFor={resource}
                className="inline-grid cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 text-base text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:bg-white peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500"
              >
                <span>{name}</span>
                <span className="text-sm font-normal text-gray-400">
                  {description}
                </span>
              </Label>
            </div>
          ))}
        </fieldset>

        <div className="flex justify-end">
          <SubmitButton pendingText="Starting integration...">
            Start Integration
          </SubmitButton>
        </div>
      </div>
    </FormDrawer>
  );
}
