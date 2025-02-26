import { Tables } from "@/types/supabase";
import { formatMinutesToHoursAndMinutes } from "@/utils/formatter";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { Card } from "flowbite-react";
import { BanknoteIcon, PiggyBankIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import TimerButtons from "./timer-buttons";
import Timesheet from "./timesheet";

export interface ITimesheet extends Tables<"business_location_job_timesheets"> {
  profile: Tables<"profiles">;
}

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: timesheets, error } = await supabase
    .from("business_location_job_timesheets")
    .select("*, profile: profile_id(*)")
    .overrideTypes<ITimesheet[]>();
  if (error) throw error;

  const employeeTimesheetDictionary = timesheets.reduce<{
    [k: string]: ITimesheet[];
  }>((dictionary, timesheet) => {
    dictionary[timesheet.profile_id] = (
      dictionary[timesheet.profile_id] ?? []
    ).concat(timesheet);

    return dictionary;
  }, {});

  const { paid, unpaid } = timesheets.reduce(
    (dictionary, timesheet) => {
      const minutes = dayjs(timesheet.end_datetime ?? undefined).diff(
        dayjs(timesheet.start_datetime),
        "minutes",
      );

      dictionary[timesheet.paid ? "paid" : "unpaid"] += minutes;

      return dictionary;
    },
    {
      paid: 0,
      unpaid: 0,
    },
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 sm:flex-nowrap lg:gap-6">
        {[
          {
            name: "Unpaid",
            status: "unpaid",
            value: unpaid,
            classNames: "fill-red-400/20 stroke-red-400",
            progressClassNames: "text-red-400",
            icon: PiggyBankIcon,
          },
          {
            name: "Paid",
            status: "paid",
            value: paid,
            classNames: "fill-green-400/20 stroke-green-400",
            progressClassNames: "text-green-400",
            icon: BanknoteIcon,
          },
        ].map((tile) => (
          <div
            key={tile.name}
            className="flex grow items-center gap-4 rounded-lg border border-gray-100 bg-white px-4 py-4 shadow-sm shadow-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900 sm:justify-center lg:gap-6 lg:py-6"
          >
            <div className="relative size-16 flex-shrink-0">
              <svg
                className="size-full -rotate-90"
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  className="stroke-current text-gray-200 dark:text-neutral-700"
                  strokeWidth="2"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  className={twMerge("stroke-current", tile.progressClassNames)}
                  strokeWidth={2}
                />
              </svg>

              <div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <tile.icon
                  className={twMerge(
                    "size-6 fill-lime-600/20 stroke-lime-600 stroke-2",
                    tile.classNames,
                  )}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h6 className="whitespace-nowrap font-medium">{tile.name}</h6>
              </div>
              <p className="text-4xl text-gray-400">
                {formatMinutesToHoursAndMinutes(Number(tile.value))}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <TimerButtons timesheetDictionary={employeeTimesheetDictionary} />
      </div>

      {Object.entries(employeeTimesheetDictionary).map(
        ([profileId, employeeTimesheets]) => {
          const totalMinutes = employeeTimesheets.reduce(
            (dictionary, timesheet) => {
              dictionary += dayjs(timesheet.end_datetime ?? undefined).diff(
                dayjs(timesheet.start_datetime),
                "minutes",
              );

              return dictionary;
            },
            0,
          );

          return (
            <Card key={profileId}>
              <div className="overflow-x-auto">
                <h3 className="pb-4 text-lg font-semibold">
                  {employeeTimesheets[0].profile.full_name}
                  <span className="ml-2 font-light text-gray-400">
                    {formatMinutesToHoursAndMinutes(totalMinutes)}
                  </span>
                </h3>
                <Timesheet rows={employeeTimesheets} />
              </div>
            </Card>
          );
        },
      )}
    </>
  );
}
