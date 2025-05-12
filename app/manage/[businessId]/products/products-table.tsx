"use client";
import { ConfirmModal } from "@/components/confirm-modal";
import { useUserContext } from "@/contexts/user";
import { formatAsCurrency } from "@/utils/formatter";
import {
  Dropdown,
  DropdownItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Tooltip,
} from "flowbite-react";
import { EllipsisVertical, SettingsIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { DeleteProduct } from "./actions";
import { IBusinessProductWithLocation } from "./page";
import UpdateProductDrawer from "./update-product-drawer";

type TTableColumnConfig = {
  field: string;
  header: string;
  cellClassNames?: string;
  render: (r: IBusinessProductWithLocation) => ReactNode;
};

function ActionsCell({ row }: { row: IBusinessProductWithLocation }) {
  const [isUpdateProductDrawerOpen, setIsUpdateProductDrawerOpen] =
    useState(false);

  const router = useRouter();

  const handleDelete = async () => {
    await DeleteProduct(row.id);
    router.refresh();
  };

  return (
    <>
      {isUpdateProductDrawerOpen && (
        <UpdateProductDrawer
          isOpen
          product={row}
          setIsOpen={setIsUpdateProductDrawerOpen}
        />
      )}
      <div className="relative hidden items-center gap-2 sm:flex">
        <>
          <Tooltip content="Settings">
            <span
              className="cursor-pointer text-lg text-gray-500 active:opacity-50 dark:text-gray-300"
              onClick={() => setIsUpdateProductDrawerOpen(true)}
            >
              <SettingsIcon />
            </span>
          </Tooltip>
          <Tooltip content="Delete">
            <ConfirmModal
              description={`Are you sure you want to remove ${row.name}?`}
              onConfirmClick={handleDelete}
              trigger={(toggle) => (
                <span
                  className="cursor-pointer text-lg text-red-500 active:opacity-50"
                  onClick={toggle}
                >
                  <Trash2Icon />
                </span>
              )}
            />
          </Tooltip>
        </>
      </div>
      <div className="w-2 sm:hidden">
        <Dropdown
          label=""
          renderTrigger={() => <EllipsisVertical />}
          size="sm"
          dismissOnClick={false}
        >
          <DropdownItem onClick={() => setIsUpdateProductDrawerOpen(true)}>
            Settings
          </DropdownItem>
          <ConfirmModal
            description={`Are you sure you want to remove ${row.name}?`}
            onConfirmClick={handleDelete}
            trigger={(toggle) => (
              <DropdownItem onClick={toggle}>Delete</DropdownItem>
            )}
          />
        </Dropdown>
      </div>
    </>
  );
}

export default function ProductsTable({
  products,
}: {
  products: IBusinessProductWithLocation[];
}) {
  const { user } = useUserContext();

  const columns: TTableColumnConfig[] = [
    {
      cellClassNames: "",
      field: "name",
      header: "Name",
      render: (row) => (
        <>
          <span className="hidden sm:table-cell">{row.name}</span>
          <span className="grid gap-2 sm:hidden">
            <div>{row.name}</div>
            <div>{`${formatAsCurrency(row.unit_price)} per ${row.unit}`}</div>
          </span>
        </>
      ),
    },
    {
      cellClassNames: "hidden sm:table-cell",
      field: "unit",
      header: "Unit",
      render: (row) => row.unit,
    },
    {
      cellClassNames: "text-right hidden sm:table-cell",
      field: "unit_price",
      header: "Price Per",
      render: (row) => formatAsCurrency(row.unit_price),
    },
    {
      cellClassNames: "text-right hidden sm:table-cell",
      field: "lead_price",
      header: "Lead Price",
      render: (row) => formatAsCurrency(row.lead_price),
    },
    {
      cellClassNames: "text-right hidden sm:table-cell",
      field: "min_units",
      header: "Min Units",
      render: (row) => row.min_units,
    },
    {
      cellClassNames: "w-0",
      field: "actions",
      header: "",
      render: (row) =>
        ["admin", "manager"].includes(user?.business?.role || "base") ? (
          <ActionsCell row={row} />
        ) : (
          ""
        ),
    },
  ];

  return (
    <div
      id="jobs-table"
      className="grid gap-4 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900"
    >
      <Table>
        <TableHead>
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
          {products.map((product) => (
            <TableRow
              key={product.id}
              className="border-b border-dashed border-gray-200 dark:border-gray-700"
            >
              {columns.map((column) => (
                <TableCell key={column.header}>
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
