"use client";

import ErrorAlert from "@/components/error-alert";
import initialFormState from "@/constants/initial-form-state";
import { useLocationContext } from "@/contexts/location";
import { useUserContext } from "@/contexts/user";
import { IJob } from "@/types/job";
import { Tables } from "@/types/supabase";
import dayjs from "dayjs";
import {
  Alert,
  Avatar,
  Button,
  Label,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  TextInput,
  Tooltip,
} from "flowbite-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  DragEvent,
  Fragment,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { addJobAppointment } from "./actions";
import getInitials from "@/utils/get-initials";
import { TAppointment } from "@/types/appointments";

type TDragAndDropScheduler = {
  appointments: TAppointment[];
  jobs: IJob[];
};

function DaysOfWeek() {
  const searchParams = useSearchParams();
  const selectedDayjs = dayjs(searchParams.get("selectedDate") ?? undefined);
  const startOfWeek = selectedDayjs.startOf("week");
  const days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));

  return (
    <div className="sticky top-0 z-20 grid gap-2 border-b-2 border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 md:grid-cols-7">
      <div className="hidden md:contents">
        {days.map((day) => (
          <Link
            className={twMerge(
              selectedDayjs.isSame(day, "day")
                ? "bg-primary-100 dark:bg-primary-700"
                : "bg-gray-100 dark:bg-gray-700",
              "mx-auto grid aspect-square w-fit place-items-center rounded-full p-2",
            )}
            href={`?selectedDate=${day.format("YYYY-MM-DD")}`}
            key={day.format("D")}
          >
            <span className="text-xs">{day.format("ddd")}</span>
            <span className="font-semibold">{day.format("D")}</span>
          </Link>
        ))}
      </div>
      <div className="md:hidden">{selectedDayjs.format("MMMM DD, YYYY")}</div>
    </div>
  );
}

function NewAppointmentModal({
  newAppointment,
  close,
}: {
  newAppointment: Partial<Tables<"business_location_job_appointments">>;
  close: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useUserContext();
  const {
    location: { profiles },
  } = useLocationContext();
  const [state, dispatch] = useActionState(addJobAppointment, initialFormState);
  const { businessId, locationId } = useParams();
  const startOfStartDay = dayjs(newAppointment?.start_datetime)
    .startOf("day")
    .format("YYYY-MM-DDTHH:mm");
  const endOfStartDay = dayjs(newAppointment?.start_datetime)
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm");

  return (
    <Modal dismissible show={Boolean(newAppointment)} onClose={close}>
      <ModalHeader>Add to schedule</ModalHeader>
      <ModalBody>
        {state.error && (
          <div className="my-4">
            <ErrorAlert message={state.error} />
          </div>
        )}
        {state.success && (
          <div className="my-4">
            <Alert>Added to schedule</Alert>
          </div>
        )}
        <form action={dispatch} className="grid gap-4" ref={formRef}>
          <input name="profile_id" type="hidden" value={user.id} />
          <input name="business_id" type="hidden" value={businessId} />
          <input name="job_id" type="hidden" value={newAppointment?.job_id} />
          <input name="location_id" type="hidden" value={locationId} />
          <div className="grid gap-1">
            <Label htmlFor="type">Type</Label>
            <Select defaultValue="" id="type" name="type" required>
              <option value="">Select a type</option>
              <option value="install">Install</option>
              <option value="demolition">Demolition</option>
              <option value="walkthrough">Walkthrough</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label>Start time</Label>
              <TextInput
                defaultValue={newAppointment?.start_datetime}
                max={endOfStartDay}
                min={startOfStartDay}
                name="start_datetime"
                type="datetime-local"
                step={300}
              />
            </div>
            <div className="grid gap-1">
              <Label>End time</Label>
              <TextInput
                defaultValue={dayjs(newAppointment?.start_datetime)
                  .add(30, "minutes")
                  .format("YYYY-MM-DDTHH:mm")}
                max={endOfStartDay}
                min={startOfStartDay}
                name="end_datetime"
                type="datetime-local"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profiles">Employees</Label>
            <Select id="profiles" name="profiles" multiple size={4} required>
              {profiles.map((profile) => (
                <option
                  key={profile.profile_id}
                  className="mb-1 p-2"
                  value={profile.profile_id}
                >
                  {profile.profile.full_name}
                </option>
              ))}
            </Select>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => formRef.current?.requestSubmit()}
        >
          Confirm
        </Button>
        <Button color="gray" onClick={close}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

function HorizontalTimeLines() {
  const [newAppointment, setNewAppointment] = useState<Partial<
    Tables<"business_location_job_appointments">
  > | null>(null);

  const handleDrop = (e: DragEvent<HTMLTimeElement>) => {
    setNewAppointment({
      start_datetime: e.currentTarget.dateTime,
      job_id: Number(e.dataTransfer.getData("id")),
    });
  };

  const searchParams = useSearchParams();
  const hoursArray = Array.from({ length: 24 }, (_, i) =>
    dayjs(searchParams.get("selectedDate") ?? undefined)
      .startOf("day")
      .add(i, "h"),
  );

  return (
    <div className="z-0 col-start-1 col-end-2 row-start-1 grid grid-rows-[repeat(48,minmax(3rem,1fr))] divide-y divide-gray-100 dark:divide-gray-700">
      {hoursArray.map((hour) => (
        <Fragment key={hour.toString()}>
          <time
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            dateTime={hour.format("YYYY-MM-DDTHH:mm")}
          >
            <div className="-mt-3.5 w-fit rounded-sm bg-white p-1 text-right text-xs leading-5 text-gray-400 dark:bg-gray-700 md:ml-4">
              {hour.format("hh:mm A")}
            </div>
          </time>
          <time
            dateTime={hour.add(30, "minutes").format("YYYY-MM-DDTHH:mm")}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="-mt-3.5 w-fit rounded-sm bg-white p-1 text-right text-xs leading-5 text-gray-400 dark:bg-gray-700 md:ml-4">
              {hour.add(30, "minutes").format("hh:mm A")}
            </div>
          </time>
        </Fragment>
      ))}
      {newAppointment && (
        <NewAppointmentModal
          newAppointment={newAppointment}
          close={() => setNewAppointment(null)}
        />
      )}
    </div>
  );
}

const calculateGridRowStartAndSpan = (start: string, end: string) => {
  const rowPadding = 1;
  const startDayjs = dayjs(start);
  const endDayjs = dayjs(end);

  const startMinutesToDecimal =
    startDayjs.get("m") > 0 ? startDayjs.get("m") / 60 : 0;
  const gridRowStart =
    (startDayjs.get("h") + startMinutesToDecimal) * 12 + rowPadding;
  const diffTime = endDayjs.diff(startDayjs, "m") / 60;
  const gridRowSpan = diffTime * 12;

  return { gridRowStart, gridRowSpan };
};
function DayAppointments({ appointments }: { appointments: TAppointment[] }) {
  return (
    <ol className="col-start-1 col-end-2 row-start-1 ml-20 mr-4 grid h-full grid-cols-1 grid-rows-[repeat(288,minmax(0,1fr))_auto] md:ml-24">
      {appointments.map((appointment) => {
        const { gridRowStart, gridRowSpan } = calculateGridRowStartAndSpan(
          appointment.start_datetime,
          appointment.end_datetime,
        );

        return (
          <li
            className="relative bg-yellow-100 dark:bg-gray-700"
            key={appointment.id}
            style={{
              gridRow: `${gridRowStart} / span ${gridRowSpan}`,
            }}
          >
            <div className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg p-2 text-xs leading-5">
              <p>
                <time
                  dateTime={dayjs(appointment.start_datetime).format(
                    "YYYY-MM-DDTHH:mm",
                  )}
                >
                  {dayjs(appointment.start_datetime).format("hh:mm a")}
                </time>
                {" - "}
                <time
                  dateTime={dayjs(appointment.end_datetime).format(
                    "YYYY-MM-DDTHH:mm",
                  )}
                >
                  {dayjs(appointment.end_datetime).format("hh:mm a")}
                </time>
              </p>
              <p className="font-semibold capitalize">{appointment.type}</p>
              <p className="font-semibold capitalize">
                {appointment.job.full_name}
              </p>
              <p className="text-xs">{`${appointment.job.address}, ${appointment.job.city} ${appointment.job.state}`}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1">
                {appointment.profiles.map((profile) => (
                  <Tooltip
                    content={profile.profile.full_name}
                    placement="bottom"
                    key={profile.profile.id}
                  >
                    <Avatar
                      placeholderInitials={getInitials(
                        profile.profile.full_name ?? "",
                      )}
                      rounded
                      size="xs"
                    />
                  </Tooltip>
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function JobsWithoutAppointments({ jobs }: { jobs: IJob[] }) {
  const jobsWithoutAppointments = jobs?.filter(
    (job) => job.appointments?.length === 0,
  );

  return jobsWithoutAppointments?.length > 0 ? (
    <List className="grid gap-2" unstyled>
      {jobsWithoutAppointments.map((job) => (
        <ListItem
          className="cursor-move rounded-sm border-l-8 border-green-500 bg-white p-4"
          key={job.id}
          draggable
          onDragStart={(e) => e.dataTransfer.setData("id", job.id.toString())}
        >
          <div>
            <p className="text-xs font-bold">
              {job.estimated_start_date
                ? dayjs(job.estimated_start_date).format("MM/DD/YYYY")
                : "No start date"}
            </p>
            <p>{job.full_name}</p>
            <p className="text-sm">{`${job.address}, ${job.city} ${job.state}`}</p>
          </div>
        </ListItem>
      ))}
    </List>
  ) : (
    <p className="bg-white p-4 text-center">
      All caught up. No unscheduled appointments.
    </p>
  );
}

export default function DragAndDropScheduler({
  appointments,
  jobs,
}: TDragAndDropScheduler) {
  const isolatedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isolatedRef?.current) {
      const diffMinutes = dayjs().diff(dayjs().startOf("day"), "m") / 60;
      const rows = diffMinutes * 12;
      const rowSize = 7;
      isolatedRef.current.scrollTo(0, rows * rowSize);
    }
  }, [isolatedRef]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <div
        className="relative overflow-scroll bg-white dark:bg-gray-800 md:max-h-[80vh]"
        ref={isolatedRef}
      >
        <DaysOfWeek />
        <br />
        <div className="grid grid-cols-1 grid-rows-1">
          <HorizontalTimeLines />
          <DayAppointments appointments={appointments} />
        </div>
      </div>
      <JobsWithoutAppointments jobs={jobs} />
    </div>
  );
}
