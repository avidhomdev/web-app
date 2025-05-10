"use client";

import { ILocationJob } from "@/contexts/location";
import { Card } from "flowbite-react";

export function JobsList({ jobs }: { jobs: ILocationJob[] }) {
  return (
    <div className="hidden h-full flex-col gap-4 bg-gray-100 p-4 dark:bg-gray-700 md:col-span-3 md:flex">
      <hgroup>
        <h2 className="text-xl font-semibold">Jobs</h2>
        <p className="text-xs text-gray-400">
          Drag a job onto the calendar to begin scheduling
        </p>
      </hgroup>
      <div className="grid gap-2">
        {jobs.map((job) => (
          <Card
            draggable
            className="cursor-move"
            key={job.id}
            onDragStart={(e) =>
              e.dataTransfer.setData("id", JSON.stringify(job))
            }
          >
            <div>
              <h3>{job.full_name}</h3>
              <p className="text-xs">{`${job.products.length} products`}</p>
              <p className="text-xs">{`${job.address}, ${job.city}`}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
