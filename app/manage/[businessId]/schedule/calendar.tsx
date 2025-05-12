"use client";

import dayjs, { Dayjs } from "dayjs";
import { Button, Card, theme } from "flowbite-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { BusinessAppointment } from "./page";

type CalendarDayProps = {
  appointments: BusinessAppointment[];
  day: Dayjs;
};

function CalendarDay({ appointments, day }: CalendarDayProps) {
  return (
    <Card
      className="rounded-none text-left hover:border-gray-200 dark:hover:border-gray-900"
      theme={{
        root: {
          children: twMerge(
            theme.card.root.children,
            "p-0 justify-start items-start gap-2",
          ),
        },
      }}
    >
      <span className="rounded-br-lg border-b border-r border-gray-100 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900">
        {day.date()}
      </span>
      {appointments ? (
        <ul className="grid w-full list-none gap-1 px-2 pb-2">
          {appointments.map((appointment, i) => (
            <li
              className="rounded-sm bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-900 dark:hover:bg-gray-800"
              key={i}
            >
              <div>
                <p className="text-xs">{appointment.location.name}</p>
                <p className="text-xs">{`${dayjs(appointment.start_datetime).format("hh:mm a")} - ${dayjs(appointment.end_datetime).format("hh:mm a")}`}</p>
                <p className="text-xs">
                  {appointment.job
                    ? `JOB-${appointment.job.id}`
                    : appointment.name}
                  <br />
                </p>
                <ul>
                  {appointment.profiles.map((profile) => (
                    <li key={profile.profile_id}>
                      {profile.profile.full_name}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <span className="mb-2 self-center p-2 text-center text-xs">
          No jobs scheduled.
        </span>
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
    <Card>
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

              return appts;
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
