"use client";

import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { useUserContext } from "@/contexts/user";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button, ButtonGroup } from "flowbite-react";
import { AlarmClockIcon, PlayCircleIcon, StopCircleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useActionState } from "react";
import { UpdateTimesheet } from "./actions";
import { ITimesheet } from "./page";

dayjs.extend(relativeTime);

export default function TimerButtons({
  timesheetDictionary,
}: {
  timesheetDictionary: { [k: string]: ITimesheet[] };
}) {
  const { user } = useUserContext();
  const { businessId, locationId, jobId } = useParams();
  const userTimesheets = timesheetDictionary[user.id];
  const startedTimesheet = userTimesheets?.find((t) => !t.end_datetime);
  const hasStartedTimesheet = !!startedTimesheet;

  const [, action] = useActionState(
    UpdateTimesheet<TInitialFormState>,
    initialFormState,
  );

  return (
    <form action={action} className="flex items-center gap-2 sm:gap-4 md:gap-6">
      <input type="hidden" name="id" value={startedTimesheet?.id ?? ""} />
      <input type="hidden" name="business_id" value={businessId} />
      <input type="hidden" name="location_id" value={locationId} />
      <input type="hidden" name="job_id" value={jobId} />
      <input type="hidden" name="profile_id" value={user.id} />
      <input
        type="hidden"
        name={hasStartedTimesheet ? "end_datetime" : "start_datetime"}
      />
      <ButtonGroup>
        <Button color="green" disabled={hasStartedTimesheet} type="submit">
          <PlayCircleIcon className="mr-2 size-5" />
          Start
        </Button>
        <Button color="red" disabled={!hasStartedTimesheet} type="submit">
          <StopCircleIcon className="mr-2 size-5" />
          Stop
        </Button>
      </ButtonGroup>
      <div className="flex items-center gap-1 text-sm">
        <AlarmClockIcon className="size-5" />
        {startedTimesheet
          ? dayjs(startedTimesheet.start_datetime).fromNow()
          : "Not started"}
      </div>
    </form>
  );
}
