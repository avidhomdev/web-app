"use client";

import ErrorAlert from "@/components/error-alert";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { ILocationJob, useLocationContext } from "@/contexts/location";
import { dayjsLocalDate } from "@/utils/dayjs-helpers";
import { createClient } from "@/utils/supabase/client";
import dayjs, { Dayjs } from "dayjs";
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  Checkbox,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  theme,
} from "flowbite-react";
import { useParams, useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { AddJobToSchedule } from "./action";
import { BusinessAppointment } from "./page";
import getInitials from "@/utils/get-initials";
import { DAYJS_DATETIME } from "@/enums/dayjs-formats";

type InstallerReturnType = Record<
  string,
  { profile_id: string; full_name: string }
>;

function useLocationInstallers({
  locationId,
  range,
}: {
  locationId: number;
  range: { start: string; end: string };
}) {
  const [installers, setInstallers] = useState<
    { profile_id: string; full_name: string }[]
  >([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchRpc = () =>
      supabase
        .rpc("location_installers_available", {
          lid: locationId,
          start_timestamp: range.start,
          end_timestamp: range.end,
        })
        .then(({ data }) => {
          if (data) setInstallers(data);
        });

    if (locationId && range.start && range.end) fetchRpc();
  }, [supabase, locationId, range.start, range.end]);

  return installers.reduce<InstallerReturnType>((dictionary, installer) => {
    dictionary[installer.profile_id] = installer;
    return dictionary;
  }, {});
}

function CalendarDayModal({
  close,
  day,
  selectedJob,
}: {
  close: () => void;
  day: Dayjs;
  selectedJob: ILocationJob;
}) {
  const {
    location: { profiles },
  } = useLocationContext();
  const startOfDayMinString = day.startOf("day").format(DAYJS_DATETIME);
  const endOfDayMinString = day.endOf("day").format(DAYJS_DATETIME);
  const [range, setRange] = useState({
    start: startOfDayMinString,
    end: endOfDayMinString,
  });
  const router = useRouter();

  const [state, action] = useActionState(AddJobToSchedule<TInitialFormState>, {
    ...initialFormState,
    data: {
      business_id: selectedJob.business_id,
      customer_id: selectedJob.customer_id,
      location_id: selectedJob.business_location_id,
      job_id: selectedJob.id,
      start_datetime: dayjs(day)
        .set("h", 7)
        .set("m", 0)
        .set("s", 0)
        .format(DAYJS_DATETIME),
      end_datetime: dayjs(day)
        .set("h", 17)
        .set("m", 0)
        .set("s", 0)
        .format(DAYJS_DATETIME),
      profiles: {},
    },
  });

  const installers = useLocationInstallers({
    locationId: Number(selectedJob.business_location_id),
    range,
  });

  useEffect(() => {
    if (state.success && state.data) {
      router.refresh();
      if (state.dismiss) close();
    }
  }, [state.success, state.dismiss, router, state.data, close]);

  return (
    <Modal dismissible show onClose={close}>
      <ModalHeader>
        <span>{`Add JOB-${selectedJob.id} to the schedule on ${dayjsLocalDate(day)}`}</span>
      </ModalHeader>
      <ModalBody>
        {state.error && (
          <div className="my-4">
            <ErrorAlert message={state.error} />
          </div>
        )}
        <Card
          theme={{
            root: {
              base: twMerge(theme.card.root.base, " shadow-xs"),
              children: twMerge(theme.card.root.children, "p-3"),
            },
          }}
        >
          <ul className="grid gap-2">
            <li>{selectedJob.full_name}</li>
            <li>
              <b>Address:</b>
              <p className="ml-2 text-sm">
                {selectedJob.address}
                <br />
                {`${selectedJob.city}, ${selectedJob.state}`}
              </p>
            </li>
            <li>
              <b>Products</b>
              {selectedJob.products.length ? (
                <ul className="ml-2 text-sm">
                  {selectedJob.products.map((product) => (
                    <li
                      key={product.id}
                    >{`${product.number_of_units} ${product.product.unit} - ${product.product.name}`}</li>
                  ))}
                </ul>
              ) : (
                <p className="ml-2 text-sm">No products</p>
              )}
            </li>
          </ul>
        </Card>
        <br />
        <form action={action} className="grid gap-6" id="add-job-to-schedule">
          <input
            type="hidden"
            name="business_id"
            value={state.data.business_id}
          />
          <input
            type="hidden"
            name="customer_id"
            value={state.data.customer_id}
          />
          <input
            type="hidden"
            name="location_id"
            value={state.data.location_id}
          />
          <input type="hidden" name="job_id" value={state.data.job_id} />
          <fieldset className="grid gap-2">
            <h3>When</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1">
                <Label>Start</Label>
                <TextInput
                  defaultValue={state.data.start_datetime}
                  min={startOfDayMinString}
                  max={endOfDayMinString}
                  name="start_datetime"
                  onChange={(e) =>
                    setRange((prevState) => ({
                      ...prevState,
                      start: e.target.value,
                    }))
                  }
                  required
                  type="datetime-local"
                />
              </div>
              <div className="grid gap-1">
                <Label>End</Label>
                <TextInput
                  defaultValue={state.data.end_datetime}
                  min={range.start}
                  max={endOfDayMinString}
                  name="end_datetime"
                  onChange={(e) =>
                    setRange((prevState) => ({
                      ...prevState,
                      end: e.target.value,
                    }))
                  }
                  required
                  type="datetime-local"
                />
              </div>
            </div>
          </fieldset>
          <fieldset className="grid gap-2">
            <h3>Who</h3>
            <ul>
              {profiles.flatMap((profile) =>
                profile.is_installer ? (
                  <li key={profile.profile_id}>
                    <Label
                      className="flex items-center gap-2"
                      disabled={!installers[profile.profile_id!]}
                      htmlFor={profile.profile_id}
                    >
                      <Checkbox
                        defaultChecked={Boolean(
                          state.data.profiles[profile.profile_id!],
                        )}
                        disabled={!installers[profile.profile_id!]}
                        id={profile.profile_id}
                        name={`profiles__${profile.profile_id}__profile_id`}
                        value={profile.profile_id}
                      />
                      <span>
                        {profile.profile.full_name}
                        {!installers[profile.profile_id!] ? (
                          <small className="italic">
                            {" "}
                            (has overlapping appointment)
                          </small>
                        ) : (
                          ""
                        )}
                      </span>
                    </Label>
                  </li>
                ) : (
                  []
                ),
              )}
            </ul>
          </fieldset>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" form="add-job-to-schedule" type="submit">
          Confirm
        </Button>
        <Button color="gray" onClick={close}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

type CalendarDayProps = {
  appointments: BusinessAppointment[];
  day: Dayjs;
};

function CalendarDay({ appointments, day }: CalendarDayProps) {
  const isToday = day.isSame(dayjs(), "day");
  const isBeforeToday = day.isBefore(dayjs(), "date");
  const [selectedJob, setSelectedJob] = useState<ILocationJob | null>(null);
  const sortedAppointments = appointments.toSorted(
    (a, b) => dayjs(a.start_datetime).unix() - dayjs(b.start_datetime).unix(),
  );
  return (
    <Card
      onDrop={(e) =>
        (isToday || !isBeforeToday) &&
        setSelectedJob(JSON.parse(e.dataTransfer.getData("id")))
      }
      theme={{
        root: {
          base: twMerge(
            theme.card.root.base,
            isToday &&
              "bg-primary-50 border-primary-200 hover:border-primary-300 dark:bg-gray-700 dark:border-primary-600",
            !isToday && isBeforeToday && "bg-gray-50 dark:bg-gray-900",
            "shadow-none rounded-none text-left hover:border-gray-200 dark:hover:border-gray-900 min-h-32",
          ),
          children: twMerge(
            theme.card.root.children,
            "p-0 justify-start items-start gap-2",
          ),
        },
      }}
    >
      <span
        className={twMerge(
          "rounded-br-lg border-r border-b border-gray-100 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900",
          isBeforeToday && "text-gray-300",
        )}
      >
        {day.date()}
      </span>
      {appointments ? (
        <ul className="grid w-full list-none gap-1 px-2 pb-2">
          {sortedAppointments.map((appointment, i) => {
            const dayIsAfterStartDay = day.isAfter(
              dayjs(appointment.start_datetime),
              "date",
            );
            const isEndDayAfterToday = dayjs(appointment.end_datetime).isAfter(
              day,
              "date",
            );
            return (
              <li
                className="rounded border border-blue-200 bg-blue-50 p-2 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800"
                key={i}
              >
                <div className="relative grid gap-1">
                  <div>
                    <p className="text-xs">
                      {dayIsAfterStartDay && isEndDayAfterToday
                        ? "All Day"
                        : `${dayjs(appointment.start_datetime).format("hh:mm a")} - ${dayjs(appointment.end_datetime).format("hh:mm a")}`}
                    </p>
                    <p className="text-xs font-bold">{`JOB-${appointment.job.id}`}</p>
                  </div>
                  <AvatarGroup className="absolute top-0 right-0">
                    {appointment.profiles.slice(0, 3).map((profile) => (
                      <Avatar
                        rounded
                        stacked
                        size="sm"
                        placeholderInitials={getInitials(
                          profile.profile.full_name!,
                        )}
                        key={profile.profile_id}
                      />
                    ))}
                  </AvatarGroup>
                  <ul></ul>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <span className="mb-2 self-center p-2 text-center text-xs">
          No jobs scheduled.
        </span>
      )}
      {selectedJob && (
        <CalendarDayModal
          day={day}
          selectedJob={selectedJob}
          close={() => setSelectedJob(null)}
        />
      )}
    </Card>
  );
}

const UNIQUE_DATE_KEY_FORMAT = "MMDDYYYYHH00A";
type AppointmentsByDateType = Record<string, BusinessAppointment[]>;

export function Calendar({
  appointments,
}: {
  appointments: BusinessAppointment[];
}) {
  const { locationId } = useParams();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");

  const daysInMonth = Array.from({
    length: endOfMonth.diff(startOfMonth, "days") + 1,
  }).map((_, i) => startOfMonth.date(i + 1));

  const startOfTheMonthEmptyDaysArray = Array.from({
    length: startOfMonth.day(),
  }).map((_, i) => i);

  const prevMonth = () =>
    setCurrentDate((prevState) => prevState.subtract(1, "month"));
  const nextMonth = () =>
    setCurrentDate((prevState) => prevState.add(1, "month"));

  const monthName = currentDate.format("MMMM YYYY");

  const appointmentsByDate = appointments.reduce<AppointmentsByDateType>(
    (dictionary, appt) => {
      const startDateTime = dayjs(appt.start_datetime);
      const endDateTime = dayjs(appt.end_datetime);
      const daysDiff = endDateTime.diff(startDateTime, "days");

      Array.from({ length: daysDiff + 1 }).forEach((_, i) => {
        const dateKey = dayjs(startDateTime)
          .add(i, "days")
          .format(UNIQUE_DATE_KEY_FORMAT);

        dictionary[dateKey] = (dictionary[dateKey] ?? []).concat(appt);
      });

      return dictionary;
    },
    {},
  );

  return (
    <Card onDragOver={(e) => e.preventDefault()}>
      <div className="mb-4 flex items-center justify-between">
        <Button color="gray" onClick={prevMonth}>
          Previous
        </Button>
        <h2 className="text-xl font-bold">{monthName}</h2>
        <Button color="gray" onClick={nextMonth}>
          Next
        </Button>
      </div>
      <div className="grid border-collapse grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-gray-200 p-2 text-xs font-semibold uppercase dark:bg-gray-800"
          >
            {day}
          </div>
        ))}
        {startOfTheMonthEmptyDaysArray.map((emptyDay) => (
          <Card
            className="rounded-none bg-gray-50 dark:bg-gray-900"
            key={emptyDay}
            theme={{
              root: {
                children: twMerge(
                  theme.card.root.children,
                  "p-0 justify-start items-start gap-2",
                ),
              },
            }}
          />
        ))}
        {daysInMonth.map((day) => {
          const dayKey = day.format("MMDDYYYY");
          const appointmentsOnDay = Object.entries(appointmentsByDate).flatMap(
            ([key, appts]) => {
              if (!key.startsWith(dayKey)) return [];

              return appts.filter(
                (appt) => appt.location_id === Number(locationId),
              );
            },
          );

          return (
            <CalendarDay
              day={day}
              key={dayKey}
              appointments={appointmentsOnDay}
            />
          );
        })}
      </div>
    </Card>
  );
}
