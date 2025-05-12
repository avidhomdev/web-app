import dayjs from "dayjs";
import { Card } from "flowbite-react";

export default function JobsUpcomingCard() {
  const startDateTime = dayjs().set("hour", 8).set("minute", 0);
  const numberOfIntervals = 22;
  const timeArray = Array.from<number>({ length: numberOfIntervals }).map(
    (_, int) =>
      dayjs(startDateTime)
        .add(30 * int, "minutes")
        .format("hh:mm a"),
  );

  return (
    <Card>
      <h3 className="text-lg font-semibold tracking-tighter">Upcoming Jobs</h3>
      <div className="divide grid max-h-80 gap-2 divide-red-50 overflow-auto">
        <div className="grid grid-cols-6">
          <div className="text-sm font-semibold uppercase" />
          <div className="text-sm font-semibold uppercase">Mon</div>
          <div className="text-sm font-semibold uppercase">Tue</div>
          <div className="text-sm font-semibold uppercase">Wed</div>
          <div className="text-sm font-semibold uppercase">Thu</div>
          <div className="text-sm font-semibold uppercase">Fri</div>
        </div>
        {timeArray.map((time) => (
          <div className="grid grid-cols-6 gap-2" key={time}>
            <div className="p-1 text-right text-sm font-semibold uppercase">
              {time}
            </div>
            <div className="rounded bg-gray-50 p-1 text-sm dark:bg-gray-700">
              no
            </div>
            <div className="rounded bg-gray-50 p-1 text-sm dark:bg-gray-700">
              no
            </div>
            <div className="rounded bg-gray-50 p-1 text-sm dark:bg-gray-700">
              no
            </div>
            <div className="rounded bg-gray-50 p-1 text-sm dark:bg-gray-700">
              no
            </div>
            <div className="rounded bg-gray-50 p-1 text-sm dark:bg-gray-700">
              no
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
