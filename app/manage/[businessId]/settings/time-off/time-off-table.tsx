"use client";

import DynamicTable from "@/components/dynamic-table";
import { SHORT_FRIENDLY_DATE_TIME_FORMAT } from "@/enums/dayjs-formats";
import { Tables } from "@/types/supabase";
import dayjs from "dayjs";

export default function TimeOffTable({
  rows,
}: {
  rows: Tables<"business_appointments">[];
}) {
  return (
    <DynamicTable<Tables<"business_appointments">>
      columns={[
        {
          field: "type",
          header: "Type",
          renderCell: (row) => <p className="capitalize">{row.type}</p>,
        },
        {
          field: "name",
          header: "Name",
          renderCell: (row) => row.name,
        },
        {
          field: "start_date",
          header: "Start",
          renderCell: (row) =>
            dayjs(row.start_datetime).format(SHORT_FRIENDLY_DATE_TIME_FORMAT),
        },
        {
          field: "end_date",
          header: "End",
          renderCell: (row) =>
            dayjs(row.end_datetime).format(SHORT_FRIENDLY_DATE_TIME_FORMAT),
        },
      ]}
      rows={rows}
      striped
    />
  );
}
