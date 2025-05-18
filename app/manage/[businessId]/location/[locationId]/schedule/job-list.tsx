"use client";

import { getLocationJobStatusProperties } from "@/constants/location-job-status";
import { ILocationJob } from "@/contexts/location";
import { Badge, Card } from "flowbite-react";

function JobCard({ job }: { job: ILocationJob }) {
  const jobStatusProperties = getLocationJobStatusProperties(job.status);

  return (
    <Card
      draggable
      className="cursor-move"
      key={job.id}
      onDragStart={(e) => e.dataTransfer.setData("id", JSON.stringify(job))}
    >
      <div className="grid gap-1">
        <div className="flex items-start">
          <Badge color={jobStatusProperties.color}>
            {jobStatusProperties.name}
          </Badge>
        </div>
        <div>
          <h3>{job.customer.full_name}</h3>
          <p className="text-xs">{`${job.products.length} products`}</p>
          <p className="text-xs">{`${job.address}, ${job.city}`}</p>
        </div>
      </div>
    </Card>
  );
}

export function JobsList({ jobs }: { jobs: ILocationJob[] }) {
  return (
    <div className="hidden h-full flex-col gap-4 bg-gray-100 p-4 md:col-span-3 md:flex dark:bg-gray-700">
      <hgroup>
        <h2 className="text-xl font-semibold">Jobs</h2>
        <p className="text-xs text-gray-400">
          Drag a job onto the calendar to begin scheduling
        </p>
      </hgroup>
      <div className="grid gap-2">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
