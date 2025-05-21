import PageHeaderWithActions from "@/components/page-header-with-actions";
import { IJob } from "@/types/job";
import { Tables } from "@/types/supabase";
import { formatAsCompactNumber, formatAsPercentage } from "@/utils/formatter";
import { percentageChange } from "@/utils/percentage-change";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import {
  CaptionsOffIcon,
  FilterIcon,
  LandmarkIcon,
  SignpostIcon,
  WorkflowIcon,
} from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import JobsTable from "./jobs-table";

export const metadata = {
  title: "Jobs",
  description: "",
};

function JobStatusTiles({
  previousWeek,
  jobsCount,
  jobStatusCounts,
}: {
  previousWeek:
    | Pick<Tables<"business_location_jobs">, "id" | "job_status">[]
    | null;
  jobsCount: number;
  jobStatusCounts: {
    [k: string]: number;
  };
}) {
  const previousWeekJobStatusCounts = (previousWeek ?? []).reduce(
    (dictionary, job) => {
      dictionary[job.job_status] = Number(dictionary[job.job_status] ?? 0) + 1;

      return dictionary;
    },
    {
      packet_pending: 0,
      packet_complete: 0,
      scheduled: 0,
      install_complete: 0,
      complete: 0,
      cancelled: 0,
      billed: 0,
      commissioned: 0,
    },
  );

  const tiles = [
    {
      name: "All",
      value: formatAsCompactNumber(jobsCount),
      weekly_change: percentageChange(previousWeek?.length ?? 0, jobsCount),
      classNames: "fill-lime-600/20 stroke-lime-600",
      progressClassNames: "text-lime-700 dark:text-lime-800 ",
      icon: WorkflowIcon,
      progress: 100,
    },
    {
      name: "Packet Pending",
      status: "packet_pending",
      value: formatAsCompactNumber(jobStatusCounts.new),
      weekly_change: percentageChange(
        previousWeekJobStatusCounts.packet_pending,
        jobStatusCounts.packet_pending,
      ),
      classNames: "fill-indigo-600/20 stroke-indigo-600",
      progressClassNames: "text-indigo-700 dark:text-indigo-800 ",
      icon: SignpostIcon,
      progress: 100 - (jobStatusCounts.packet_pending / jobsCount) * 100,
    },
    {
      name: "Scheduled",
      status: "scheduled",
      value: formatAsCompactNumber(jobStatusCounts.scheduled),
      weekly_change: percentageChange(
        previousWeekJobStatusCounts.scheduled,
        jobStatusCounts.scheduled,
      ),
      classNames: "fill-green-600/20 stroke-green-600",
      progressClassNames: "text-green-700 dark:text-green-800 ",
      icon: LandmarkIcon,
      progress: 100 - (jobStatusCounts.scheduled / jobsCount) * 100,
    },
    {
      name: "Cancelled",
      status: "cancelled",
      value: formatAsCompactNumber(jobStatusCounts.canceled),
      weekly_change: percentageChange(
        previousWeekJobStatusCounts.cancelled,
        jobStatusCounts.canceled,
      ),
      classNames: "fill-red-600/20 stroke-red-600",
      progressClassNames: "text-red-700 dark:text-red-800 ",
      icon: CaptionsOffIcon,
      progress: 100 - (jobStatusCounts.canceled / jobsCount) * 100,
    },
  ];

  return (
    <div className="flex w-full max-w-full items-center divide-x divide-gray-100 overflow-scroll rounded-lg border border-gray-100 bg-white py-4 shadow-lg shadow-gray-100 lg:py-6 dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900">
      {tiles.map((tile) => (
        <div
          key={tile.name}
          className="flex grow items-center justify-center gap-4 px-4 lg:gap-6"
        >
          <div className="relative size-16 shrink-0">
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
                className={twMerge(
                  "stroke-current text-lime-600 dark:text-lime-500",
                  tile.progressClassNames,
                )}
                strokeWidth="2"
                strokeDasharray="100"
                strokeDashoffset={
                  Number.isNaN(tile.progress) ? 100 : Number(tile.progress)
                }
                strokeLinecap="round"
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
              <h6 className="font-medium whitespace-nowrap">{tile.name}</h6>
              <Link
                href={`${tile.status ? `?job_status=${tile.status ?? ""}` : "?"}#jobs-table`}
                className="rounded-sm p-1 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FilterIcon className="size-5" />
              </Link>
            </div>
            <p className="text-gray-400">
              {formatAsCompactNumber(Number(tile.value))}
            </p>
            <p className="text-xs">
              Weekly Change{" "}
              <span
                className={twMerge(
                  tile.weekly_change > 0
                    ? "text-green-500 dark:text-green-300"
                    : "text-red-500 dark:text-red-300",
                )}
              >
                {formatAsPercentage(tile.weekly_change)}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function Page(props: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{
    created_after: string;
    created_before: string;
    page: number;
    per_page: number;
    products: string;
    sort: string;
    job_status: string;
  }>;
}) {
  const params = await props.params;

  const { businessId = "" } = params;

  const searchParams = await props.searchParams;

  const {
    created_after = null,
    created_before = null,
    page = 0,
    per_page = 10,
    job_status = "",
    sort = "",
  } = searchParams;

  const [sortKey, sortDirection] = sort.split("__");

  const supabase = await createSupabaseServerClient();

  const startRange =
    page > 1
      ? Number(page - 1) * Number(per_page)
      : Number(page) * Number(per_page);

  const endRange = page > 1 ? startRange + Number(per_page) : per_page;

  const fetchAllJobs = supabase
    .from("business_location_jobs")
    .select("job_status", { count: "exact" })
    .eq("business_id", businessId);

  const lastWeekDate = new Date(new Date().setDate(new Date().getDate() - 5));
  const fetchAllPreviousWeekJobs = supabase
    .from("business_location_jobs")
    .select("id,job_status")
    .eq("business_id", businessId)
    .lte("created_at", lastWeekDate.toISOString());

  const fetchTableData = supabase
    .from("business_location_jobs")
    .select(
      `*,
      creator: profiles!creator_id(id,full_name,avatar_url),
      location: business_location_id(*),
      messages: business_location_job_messages(*,author: author_id(*)),
      products: business_location_job_products(*, product: product_id(*))`,
      { count: "exact" },
    )
    .match({
      business_id: businessId,
      ...(job_status ? { job_status } : {}),
    })
    .range(startRange, endRange)
    .gte("created_at", new Date(created_after ?? "0").toISOString())
    .lte("created_at", new Date(created_before ?? "3000-01-01").toISOString())
    .order(sortKey || "estimated_end_date", {
      ascending: sortDirection === "ascending",
    })
    .overrideTypes<IJob[], { merge: false }>();

  const [
    { data: all, count },
    { data: previousWeek },
    { data, error, count: paginatedTotal },
  ] = await Promise.all([
    fetchAllJobs,
    fetchAllPreviousWeekJobs,
    fetchTableData,
  ]);

  if (error) throw error;

  const jobStatusCounts = (all ?? []).reduce(
    (dictionary, job) => {
      dictionary[job.job_status] = Number(dictionary[job.job_status] ?? 0) + 1;

      return dictionary;
    },
    {
      packet_pending: 0,
      packet_complete: 0,
      scheduled: 0,
      install_complete: 0,
      complete: 0,
      cancelled: 0,
      billed: 0,
      commissioned: 0,
    },
  );

  return (
    <div className="relative container flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <PageHeaderWithActions
        title="Jobs"
        subtitle="View and manage all of your jobs."
      />
      <JobStatusTiles
        previousWeek={previousWeek}
        jobsCount={count ?? 0}
        jobStatusCounts={jobStatusCounts}
      />
      <JobsTable
        jobsCount={count ?? 0}
        jobs={data ?? []}
        paginatedTotal={paginatedTotal ?? 0}
        jobStatusCounts={jobStatusCounts}
      />
    </div>
  );
}
