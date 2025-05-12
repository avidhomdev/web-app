"use client";

import { Tables } from "@/types/supabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Button,
  TimelineBody,
  TimelineContent,
  TimelineItem,
  TimelinePoint,
  TimelineTime,
  TimelineTitle,
} from "flowbite-react";
import { CodeIcon } from "lucide-react";
import { useState } from "react";
dayjs.extend(relativeTime);

type TLog = Tables<"business_logs"> & {
  profile: Tables<"profiles">;
};

export default function JobHistoryTimelineItem({ log }: { log: TLog }) {
  const [showMore, setShowMore] = useState(true);

  return (
    <TimelineItem key={log.id} className="mb-6">
      <TimelinePoint />
      <TimelineContent>
        <TimelineTitle>{log.message}</TimelineTitle>
        <TimelineTime>{`${dayjs(log.created_at).fromNow()} by ${log.profile.full_name}`}</TimelineTime>
        {log.snapshot && (
          <>
            <Button
              className="my-2"
              color="light"
              size="xs"
              onClick={() => setShowMore((prevState) => !prevState)}
            >
              <CodeIcon className="mr-2 size-4" />
              {`${showMore ? "Hide" : "Show"} snapshot`}
            </Button>
            {showMore && (
              <TimelineBody className="overflow-x-scroll rounded-sm bg-gray-700 p-4 text-gray-100">
                <pre className="text-xs">
                  {JSON.stringify(
                    JSON.parse(log.snapshot as string),
                    undefined,
                    2,
                  )}
                </pre>
              </TimelineBody>
            )}
          </>
        )}
      </TimelineContent>
    </TimelineItem>
  );
}
