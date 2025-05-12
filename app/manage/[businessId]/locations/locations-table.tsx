"use client";
import Linky from "@/components/linky";
import { Tables } from "@/types/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  theme,
} from "flowbite-react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type TTableColumnConfig = {
  field: string;
  header: string;
  cellClassNames?: string;
  render: (r: Tables<"business_locations">) => ReactNode;
};

export default function LocationsTable({
  locations,
}: {
  locations: Tables<"business_locations">[];
}) {
  const columns: TTableColumnConfig[] = [
    {
      field: "name",
      header: "Name",
      render: (row) => (
        <Linky href={`/manage/${row.business_id}/location/${row.id}`}>
          {row.name}
        </Linky>
      ),
    },
    {
      field: "address",
      header: "Address",
      render: (row) => `${row.address ?? ""} ${row.address2 ?? ""}`,
    },
    {
      field: "city",
      header: "City",
      render: (row) => row.city,
    },
    {
      field: "state",
      header: "State",
      render: (row) => row.state,
    },
  ];

  return (
    <div
      id="jobs-table"
      className="grid gap-4 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900"
    >
      <Table>
        <TableHead
          theme={{
            base: "rounded-none",
            cell: {
              base: twMerge(
                theme.table.head.cell.base,
                "capitalize tracking-wide text-gray-500 text-sm font-normal",
              ),
            },
          }}
        >
          <TableRow>
            {columns.map((column) => (
              <TableHeadCell
                key={column.header}
                className={column.cellClassNames ?? ""}
              >
                {column.header}
              </TableHeadCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {locations.map((product) => (
            <TableRow
              key={product.id}
              className="border-b border-dashed border-gray-200 dark:border-gray-700"
            >
              {columns.map((column) => (
                <TableCell
                  key={column.header}
                  theme={{
                    base: twMerge(
                      theme.table.body.cell.base,
                      column.cellClassNames,
                      "p-5",
                    ),
                  }}
                >
                  {column.render(product)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
