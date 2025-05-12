"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { useUserContext } from "@/contexts/user";
import { IJob } from "@/types/job";
import { formatAsReadableDate } from "@/utils/formatter";
import { Card, Datepicker, Drawer, DrawerHeader, DrawerItems, Label, List, ListItem } from "flowbite-react";
import { CalendarIcon, SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { UpdateJobEstimatedTimeline } from "./actions";

type TJobEstimatedTimelineCard = {
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
      <input
        name="location_id"
        value={job.business_location_id}
        type="hidden"
      />
      <div>
        <Label htmlFor="estimated_start_date" className="mb-2 block">
          Start date
        </Label>
        <Datepicker id="estimated_start_date" name="estimated_start_date" />
      </div>
      <div>
        <Label htmlFor="estimated_end_date" className="mb-2 block">
          End date
        </Label>
        <Datepicker id="estimated_end_date" name="estimated_end_date" />
      </div>
      <SubmitButton pendingText="Saving job...">
        <SettingsIcon className="mr-2" />
        Update job
      </SubmitButton>
    </fieldset>
  );
}

function EditDrawer({ job }: { job: IJob }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [state, action] = useActionState(
    UpdateJobEstimatedTimeline<TInitialFormState>,
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
          title="Update estimated timeline"
          titleIcon={() => <SettingsIcon className="mr-2" />}
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

export default function JobEstimatedTimelineCard({
  job,
}: TJobEstimatedTimelineCard) {
  return (
    <Card className="group">
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-lg font-semibold tracking-tighter">
          Estimated Timeline
        </h6>
        <EditDrawer job={job} />
      </div>
      <List unstyled>
        <ListItem className="flex items-center justify-between gap-2">
          <dt className="flex items-center gap-2">
            <CalendarIcon className="size-4" /> Start date
          </dt>
          <dl>
            {job.estimated_start_date
              ? formatAsReadableDate(job.estimated_start_date)
              : "Unknown"}
          </dl>
        </ListItem>
        <ListItem className="flex items-center justify-between gap-2">
          <dt className="flex items-center gap-2">
            <CalendarIcon className="size-4" /> Completion date
          </dt>
          <dl>
            {job.estimated_end_date
              ? formatAsReadableDate(job.estimated_end_date)
              : "Unknown"}
          </dl>
        </ListItem>
      </List>
    </Card>
  );
}
