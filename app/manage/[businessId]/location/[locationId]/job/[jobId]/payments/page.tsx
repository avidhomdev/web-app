import dayjs from "dayjs";
import {
  Dropdown,
  DropdownItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  theme,
} from "flowbite-react";
import { twMerge } from "tailwind-merge";

export default function Page() {
  return (
    <div className="grid gap-4 md:gap-6">
      <div className="ml-auto">
        <Dropdown label="Collect Payment">
          <DropdownItem href="/">Cash</DropdownItem>
          <DropdownItem href="/">Check</DropdownItem>
          <DropdownItem href="/">Credit Card</DropdownItem>
        </Dropdown>
      </div>
      <div
        id="jobs-table"
        className="grid gap-4 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900"
      >
        <Table
          theme={{
            row: {
              base: twMerge(
                theme.table.row.base,
                "border-b border-dashed border-gray-200 dark:border-gray-700",
              ),
            },
            body: {
              cell: {
                base: twMerge(
                  theme.table.body.cell.base,
                  "capitalize tracking-wide text-gray-500 text-sm font-normal p-5",
                ),
              },
            },
          }}
        >
          <TableHead>
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>Amount</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell />
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{dayjs().format("MM/DD/YYYY")}</TableCell>
              <TableCell>1,200</TableCell>
              <TableCell>Cash</TableCell>
              <TableCell className="w-0">Tools</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{dayjs().format("MM/DD/YYYY")}</TableCell>
              <TableCell>1,200</TableCell>
              <TableCell>Cash</TableCell>
              <TableCell className="w-0">Tools</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{dayjs().format("MM/DD/YYYY")}</TableCell>
              <TableCell>1,200</TableCell>
              <TableCell>Cash</TableCell>
              <TableCell className="w-0">Tools</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{dayjs().format("MM/DD/YYYY")}</TableCell>
              <TableCell>1,200</TableCell>
              <TableCell>Cash</TableCell>
              <TableCell className="w-0">Tools</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
