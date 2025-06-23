import dayjs from "dayjs";
import { Button } from "flowbite-react";

function DayOfWeekColumn({ day }: { day: string }) {
  return (
    <div className="flex grow flex-col items-center justify-center gap-2">
      <div>{day}</div>
      {Array.from({ length: 15 }, (_, num) => {
        const time = dayjs()
          .startOf("day")
          .set("hour", 6)
          .add(num * 1, "hour");

        return (
          <div key={time.toString()}>
            <Button color="alternative">{time.format("hh:mm a")}</Button>
          </div>
        );
      })}
    </div>
  );
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export default function Page() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <hgroup className="sm:col-span-3 md:col-span-4">
          <h2 className="font-semibold">Availability</h2>
          <p className="text-sm text-gray-400">
            Control the schedule you want to receive new appointments
          </p>
        </hgroup>
      </div>
      <div className="flex gap-2">
        {days.map((day) => (
          <DayOfWeekColumn key={day} day={day} />
        ))}
      </div>
    </div>
  );
}
