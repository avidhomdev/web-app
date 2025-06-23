"use client";

import FormDrawer from "@/components/form-drawer";
import SubmitButton from "@/components/submit-button";
import dayjs from "dayjs";
import {
  Button,
  HelperText,
  Label,
  Select,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { CalendarClockIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { AddTimeOff } from "./actions";
import { DAYJS_DATETIME } from "@/enums/dayjs-formats";
import { useUserContext } from "@/contexts/user";

export default function AddTimeOffDrawer() {
  const { user } = useUserContext();
  const [date, setDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [allDay, setAllDay] = useState(true);
  const startDatetimeRef = useRef<HTMLInputElement>(null);
  const endDatetimeRef = useRef<HTMLInputElement>(null);

  const { businessId } = useParams();

  const dateMinMax = {
    min: dayjs(date).startOf("day").format(DAYJS_DATETIME),
    max: dayjs(date).endOf("day").format(DAYJS_DATETIME),
  };

  return (
    <FormDrawer
      FormAction={AddTimeOff}
      renderTrigger={(toggle) => (
        <Button color="primary" onClick={toggle} size="sm">
          Add Time Off
        </Button>
      )}
      title="Add Time Off"
      titleIcon={() => <CalendarClockIcon className="mr-2" />}
    >
      <input type="hidden" name="business_id" value={businessId} />
      <input type="hidden" name="profile_id" value={user.id} />
      <fieldset className="grid gap-2 md:gap-4 lg:gap-6">
        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <Select defaultValue="" id="type" name="type" required>
            <option value="">Select a type</option>
            <option value="vacation">Vacation</option>
            <option value="sick">Sick</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <div>
            <TextInput id="name" name="name" type="text" />
            <HelperText>e.g. Birthday Vacation</HelperText>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <TextInput
            id="date"
            name="date"
            onChange={(e) => setDate(e.target.value)}
            type="date"
            value={date}
          />
        </div>
        <ToggleSwitch checked={allDay} label="All Day" onChange={setAllDay} />
        {allDay ? (
          <>
            <input type="hidden" value={dateMinMax.min} name="start_datetime" />
            <input type="hidden" value={dateMinMax.max} name="end_datetime" />
          </>
        ) : (
          <>
            {" "}
            <div className="grid gap-2">
              <Label htmlFor="start_datetime">Start Time</Label>
              <TextInput
                {...dateMinMax}
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
                {...dateMinMax}
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
          </>
        )}
        <SubmitButton pendingText="Adding time off...">Submit</SubmitButton>
      </fieldset>
    </FormDrawer>
  );
}
