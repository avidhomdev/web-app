"use client";

import {
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { InfoIcon } from "lucide-react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface IColumn<RowData> {
  cellClassNames?: string;
  field?: string;
  header?: string;
  renderCell: (arg: RowData) => ReactNode;
}

type TDynamicTableProps<RowData> = {
  columns: IColumn<RowData>[];
  rows: RowData[];
  striped?: boolean;
};

export default function DynamicTable<RowData>({
  columns,
  rows,
  striped,
}: TDynamicTableProps<RowData & { id: string | number }>) {
  return rows.length ? (
    <Table theme={{ root: { shadow: "" } }} striped={striped}>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableHeadCell
              className={twMerge(column.cellClassNames)}
              key={column.field}
            >
              {column.header}
            </TableHeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                className={twMerge(column.cellClassNames)}
              >
                {column.renderCell(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <Alert color="failure" icon={() => <InfoIcon className="mr-2" />}>
      <span className="font-medium">No rows found!</span> If this is an error,
      get help.
    </Alert>
  );
}
