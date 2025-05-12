"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { US_STATES } from "@/constants/us-states";
import { useUserContext } from "@/contexts/user";
import { IJob } from "@/types/job";
import { Button, Card, Drawer, DrawerHeader, DrawerItems, Label, Select, TextInput } from "flowbite-react";
import { MapIcon, MapPinIcon, MapPinnedIcon, SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { UpdateJobLocation } from "./actions";

type TJobLocationCard = {
  job: IJob;
};

function EditDrawerFormFields({ job }: { job: IJob }) {
  const { pending } = useFormStatus();
  const { user } = useUserContext();
  return (
    <fieldset disabled={pending} className="grid gap-2 lg:gap-6">
      <input name="job_id" value={job.id} type="hidden" />
      <input name="business_id" value={job.business_id} type="hidden" />
      <input name="profile_id" value={user.id} type="hidden" />
      <div>
        <Label htmlFor="address" className="mb-2 block">
          Address
        </Label>
        <TextInput
          autoComplete="off"
          id="address"
          name="address"
          defaultValue={job.address ?? ""}
        />
      </div>
      <div>
        <Label htmlFor="city" className="mb-2 block">
          City
        </Label>
        <TextInput
          autoComplete="off"
          id="city"
          name="city"
          defaultValue={job.city ?? ""}
        />
      </div>
      <div>
        <Label htmlFor="state" className="mb-2 block">
          State
        </Label>
        <Select id="state" name="state" defaultValue={job.state ?? ""}>
          <option value="" disabled>
            Select a state
          </option>
          {Object.entries(US_STATES).map(([abbr, state]) => (
            <option key={abbr} value={abbr}>
              {state}
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
          defaultValue={job.postal_code ?? ""}
        />
      </div>
      <SubmitButton pendingText="Saving location...">
        <MapPinIcon className="mr-2" />
        Update Location
      </SubmitButton>
    </fieldset>
  );
}

function EditDrawer({ job }: { job: IJob }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [state, action] = useActionState(
    UpdateJobLocation<TInitialFormState>,
    initialFormState,
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      if (state.dismiss) setIsOpen(() => false);
    }
  }, [state.success, state.dismiss, router, setIsOpen]);

  return (
    <>
      <div
        className="shrink-0 cursor-pointer rounded-full p-2 opacity-0 hover:bg-gray-100 group-hover:opacity-100 dark:hover:bg-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <SettingsIcon />
      </div>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)} position="right">
        <DrawerHeader
          title="Update location"
          titleIcon={() => <MapPinIcon className="mr-2" />}
        />
        <DrawerItems>
          {state.error && (
            <div className="my-4">
              <ErrorAlert message={state.error} />
            </div>
          )}
          <form action={action} className="my-4">
            <EditDrawerFormFields job={job} />
          </form>
        </DrawerItems>
      </Drawer>
    </>
  );
}

export default function JobLocationCard({ job }: TJobLocationCard) {
  return (
    <Card className="group">
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-lg font-semibold tracking-tighter">Location</h6>
        <EditDrawer job={job} />
      </div>
      <div className="flex flex-col items-start gap-4 lg:gap-6">
        <div className="grid aspect-video w-full place-items-center rounded-sm bg-gray-100 dark:bg-gray-700">
          <MapPinIcon className="size-14" />
          street view or aerial
        </div>
        <p>
          {job.address || "NA"}
          <br />
          {`${job.city || "NA"}, ${job.state || "NA"} ${job.postal_code || "NA"}`}
        </p>
        <div className="flex w-full items-center justify-center gap-2">
          <Button color="light">
            <div className="flex items-center gap-2">
              <MapPinnedIcon />
              Get Directions
            </div>
          </Button>
          <Button color="light">
            <div className="flex items-center gap-2">
              <MapIcon />
              Send Location
            </div>
          </Button>
        </div>
      </div>
    </Card>
  );
}
