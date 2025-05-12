"use client";

import { formatMinutesToHoursAndMinutes } from "@/utils/formatter";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { ITimesheet } from "./page";

export default function Timesheet({ rows }: { rows: ITimesheet[] }) {
  return (
    <>
      <Table striped>
        <TableHead>
          <TableRow>
            <TableHeadCell>Employee</TableHeadCell>
            <TableHeadCell>Start</TableHeadCell>
            <TableHeadCell>End</TableHeadCell>
            <TableHeadCell>Hours</TableHeadCell>
            <TableHeadCell>Paid</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {rows.map((timesheet) => (
            <TableRow
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={timesheet.id}
            >
              <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                {timesheet.profile.full_name}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {dayjs(timesheet.start_datetime).format("MM/DD hh:mm a")}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {timesheet.end_datetime
                  ? dayjs(timesheet.end_datetime).format("MM/DD hh:mm a")
                  : "Clocked in"}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatMinutesToHoursAndMinutes(
                  dayjs(timesheet.end_datetime ?? "").diff(
                    dayjs(timesheet.start_datetime),
                    "minutes",
                  ),
                )}
              </TableCell>
              <TableCell>
                {timesheet.paid ? (
                  <CheckCircleIcon className="text-green-400" />
                ) : (
                  <XCircleIcon className="text-red-400" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
