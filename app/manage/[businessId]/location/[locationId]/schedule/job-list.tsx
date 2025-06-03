"use client";

import { ILocationJob } from "@/contexts/location";
import { getJobStatusProperties } from "@/enums/job-status";
import { Badge, Card } from "flowbite-react";

function JobCard({ job }: { job: ILocationJob }) {
  const jobStatusProperties = getJobStatusProperties(job.job_status);

  return (
    <Card
      draggable
      className="cursor-move shadow-sm"
      key={job.id}
      onDragStart={(e) => e.dataTransfer.setData("job", JSON.stringify(job))}
    >
      <div className="grid gap-1">
        <div className="flex items-start">
          <Badge color={jobStatusProperties.color}>
            {jobStatusProperties.name}
          </Badge>
        </div>
        <div>
          <h3>{`JOB-${job.id}`}</h3>
          <p className="text-xs">{job.customer?.full_name}</p>
          <p className="text-xs">{`${job.address}, ${job.city}`}</p>
          <p className="text-xs">{`${job.products.length} products`}</p>
        </div>
      </div>
    </Card>
  );
}

export function JobsList({ jobs }: { jobs: ILocationJob[] }) {
  return (
    <div className="hidden h-full flex-col gap-4 bg-gray-100 p-4 md:col-span-3 md:flex lg:col-span-2 dark:bg-gray-700">
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
