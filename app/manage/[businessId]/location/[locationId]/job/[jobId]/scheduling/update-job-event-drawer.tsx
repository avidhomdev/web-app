"use client";

import FormDrawer from "@/components/form-drawer";
import SubmitButton from "@/components/submit-button";
import { Tables } from "@/types/supabase";
import dayjs from "dayjs";
import { Label, Select, TextInput } from "flowbite-react";
import { CalendarClockIcon } from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { PropsWithChildren, useRef } from "react";
import { UpdateJobEvent } from "./actions";

export default function UpdateJobEventDrawer({
  children,
  events,
}: PropsWithChildren<{
  events: Tables<"business_location_job_events">[];
}>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const event = events.find(
    (event) => event.id === Number(searchParams.get("event_id")),
  );
  const startDatetimeRef = useRef<HTMLInputElement>(null);
  const endDatetimeRef = useRef<HTMLInputElement>(null);
  const { businessId, locationId, jobId } = useParams();

  return event ? (
    <FormDrawer
      key={event.id}
      closeCallback={() => router.push(pathname)}
      defaultIsOpen
      FormAction={UpdateJobEvent}
      renderTrigger={(toggle) => (
        <div className="contents" onClick={toggle}>
          {children}
        </div>
      )}
      title="Update Event"
      titleIcon={() => <CalendarClockIcon className="mr-2" />}
    >
      <input type="hidden" name="id" value={event.id} />
      <input type="hidden" name="business_id" value={businessId} />
      <input type="hidden" name="location_id" value={locationId} />
      <input type="hidden" name="job_id" value={jobId} />
      <fieldset className="grid gap-2 md:gap-4 lg:gap-6">
        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <Select defaultValue={event.type} id="type" name="type" required>
            <option value="">Select a type</option>
            <option value="install">Install</option>
            <option value="Demolition">Demolition</option>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="start_datetime">Start Time</Label>
          <TextInput
            defaultValue={event.start_datetime}
            id="start_datetime"
            name="start_datetime"
            ref={startDatetimeRef}
            required
            type="datetime-local"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="end_datetime">End Time</Label>
          <TextInput
            defaultValue={event.end_datetime}
            id="end_datetime"
            name="end_datetime"
            onChange={(e) => {
              e.target.setCustomValidity(
                dayjs(e.target.value).isBefore(
                  startDatetimeRef.current?.value ?? undefined,
                )
                  ? "Must be after start date"
                  : "",
              );
              e.target.setCustomValidity(
                !dayjs(e.target.value).isSame(
                  startDatetimeRef.current?.value ?? undefined,
                  "day",
                )
                  ? "Must be same day as start date"
                  : "",
              );
            }}
            ref={endDatetimeRef}
            required
            type="datetime-local"
          />
        </div>
        <SubmitButton pendingText="Updating event...">Submit</SubmitButton>
      </fieldset>
    </FormDrawer>
  ) : null;
}
