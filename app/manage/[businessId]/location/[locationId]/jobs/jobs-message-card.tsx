import Linky from "@/components/linky";
import { IJob } from "@/types/job";
import getInitials from "@/utils/get-initials";
import limitStringEllipsis from "@/utils/limit-string-ellipsis";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Avatar, Card, Tooltip } from "flowbite-react";

dayjs.extend(relativeTime);

export default function JobMessageCard({ jobs }: { jobs: IJob[] }) {
  return (
    <Card>
      <h3 className="text-lg font-semibold tracking-tighter">
        Latest Messages
      </h3>
      <div className="flex max-h-80 flex-col divide-y divide-gray-100 overflow-auto dark:divide-gray-700">
        {jobs.toReversed().flatMap((job) => {
          if (!job.messages?.length) return [];

          const [latestMessage] = job.messages;

          return (
            <div key={job.id} className="grid gap-2 py-4">
              <p className="text-xs">
                Posted in{" "}
                <Linky
                  href={`/manage/${latestMessage?.business_id}/location/${latestMessage.location_id}/job/${latestMessage.job_id}`}
                >{`JOB-${job.id}`}</Linky>
                {`, ${dayjs(latestMessage.created_at).fromNow()}`}
              </p>
              <div className="flex items-center gap-2 rounded-sm">
                <Tooltip content={latestMessage.author?.full_name}>
                  <Avatar
                    rounded
                    placeholderInitials={getInitials(
                      latestMessage.author?.full_name ?? "",
                    )}
                  />
                </Tooltip>
                <p className="w-full rounded-sm border border-amber-100 bg-amber-50 p-2 text-sm dark:border-amber-800 dark:bg-amber-700">
                  {limitStringEllipsis(latestMessage?.message ?? "", 90)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
