"use client";

import { ILocationJob } from "@/contexts/location";
import pluralize from "@/utils/pluralize";
import dayjs, { Dayjs } from "dayjs";
import { Button, Card, Popover, theme } from "flowbite-react";
import { useParams } from "next/navigation";
import { DragEvent, useState } from "react";
import { twMerge } from "tailwind-merge";
import { NewAppointmentModal } from "./new-appointment-modal";
import { BusinessAppointment } from "./page";
import { UpdateAppointmentModal } from "./update-appointment-modal";

export function metadata() {
  return {
    title: "Schedule",
  };
}

type CalendarDayProps = {
  appointments: BusinessAppointment[];
  day: Dayjs;
};

function CalendarDay({ appointments, day }: CalendarDayProps) {
  const isToday = day.isSame(dayjs(), "day");
  const isBeforeToday = day.isBefore(dayjs(), "date");
  const [selectedJob, setSelectedJob] = useState<ILocationJob | null>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<BusinessAppointment | null>(null);
  const sortedAppointments = appointments.toSorted(
    (a, b) => dayjs(a.start_datetime).unix() - dayjs(b.start_datetime).unix(),
  );

  function onDrop(e: DragEvent<HTMLDivElement>) {
    if (!isToday && isBeforeToday) return;
    const transferedAppointmentData = e.dataTransfer?.getData("appointment");
    const transferedJobData = e.dataTransfer?.getData("job");

    if (transferedJobData) setSelectedJob(JSON.parse(transferedJobData));
    if (transferedAppointmentData)
      setSelectedAppointment(JSON.parse(transferedAppointmentData));
  }

  return (
    <Card
      onDrop={onDrop}
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
            const participantString = pluralize(
              "participant",
              "participants",
              appointment.profiles.length,
            );

            return (
              <li
                className="drag rounded border border-blue-200 bg-blue-50 p-2 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800"
                draggable
                key={i}
                onClick={() => setSelectedAppointment(appointment)}
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "appointment",
                    JSON.stringify(appointment),
                  )
                }
              >
                <p className="text-xs">
                  {dayIsAfterStartDay && isEndDayAfterToday
                    ? "All Day"
                    : `${dayjs(appointment.start_datetime).format("hh:mm a")} - ${dayjs(appointment.end_datetime).format("hh:mm a")}`}
                </p>
                <p className="text-xs font-bold">{`JOB-${appointment.job.id}`}</p>
                <Popover
                  content={
                    <div className="grid gap-1 p-2">
                      <b className="text-sm capitalize">{participantString}</b>
                      <hr className="border-gray-200 dark:border-gray-700" />
                      <ul className="text-xs">
                        {appointment.profiles.map((profile) => (
                          <li key={profile.profile.full_name}>
                            {profile.profile.full_name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  }
                  trigger="hover"
                >
                  <div className="cursor-pointer text-sm underline">{`${appointment.profiles.length} ${participantString}`}</div>
                </Popover>
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
        <NewAppointmentModal
          day={day}
          selectedJob={selectedJob}
          close={() => setSelectedJob(null)}
        />
      )}
      {selectedAppointment && (
        <UpdateAppointmentModal
          day={day}
          appointment={selectedAppointment}
          close={() => setSelectedAppointment(null)}
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
