"use client";

import { ConfirmModal } from "@/components/confirm-modal";
import { ILocationCustomer } from "@/types/location";
import {
  Alert,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
  theme,
  Tooltip,
} from "flowbite-react";
import {
  CircleXIcon,
  EllipsisVertical,
  InfoIcon,
  SearchIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { DeleteLocationCustomer } from "./actions";
import ManageCustomerDrawer from "./manage-customer-drawer";
import {
  DISPOSITION_STATUS_KEYS,
  DISPOSITION_STATUSES,
} from "@/constants/disposition-statuses";

const customersTableContext = createContext<{
  customers: ILocationCustomer[];
  customersCount: number | null;
  handleUpdateSearchParam: (param: string, value: string) => void;
  handleRemoveSearchParam: (param: string, value: string) => void;
  isProcessing: boolean;
  paginatedTotal: number;
}>({
  customers: [],
  customersCount: 0,
  handleUpdateSearchParam: () => null,
  handleRemoveSearchParam: () => null,
  isProcessing: false,
  paginatedTotal: 0,
});

function useCustomersTableContext() {
  const context = useContext(customersTableContext);
  if (context === undefined)
    throw new Error(
      "useCustomersTableContext needs to used be in customersTableContextProvider",
    );

  return context;
}

type TEmployeesTableProviderProps = PropsWithChildren & {
  customersCount: number | null;
  paginatedTotal: number;
  customers: ILocationCustomer[];
};

function EmployeesTableProvider({
  children,
  customers,
  customersCount,
  paginatedTotal,
}: TEmployeesTableProviderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleUpdateSearchParam = useCallback(
    (param: string, value: string) => {
      setIsProcessing(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set(param, value);

      router.push(`${pathname}?${params.toString()}`);
      setIsProcessing(false);
    },
    [pathname, router, searchParams],
  );

  const handleRemoveSearchParam = useCallback(
    (param: string, value: string) => {
      setIsProcessing(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete(param, value);

      router.push(`${pathname}?${params.toString()}`);
      setIsProcessing(false);
    },
    [pathname, router, searchParams],
  );

  const filteredCustomers = customers.filter((item) =>
    searchParams.get("search")
      ? item.full_name
          ?.toLowerCase()
          .includes(searchParams.get("search")?.toLowerCase() ?? "")
      : true,
  );

  const value = useMemo(
    () => ({
      customers: filteredCustomers,
      customersCount,
      handleUpdateSearchParam,
      handleRemoveSearchParam,
      isProcessing,
      paginatedTotal,
    }),
    [
      filteredCustomers,
      customersCount,
      handleUpdateSearchParam,
      handleRemoveSearchParam,
      isProcessing,
      paginatedTotal,
    ],
  );

  return (
    <customersTableContext.Provider value={value}>
      {children}
    </customersTableContext.Provider>
  );
}

function TableSearchFilter() {
  const [value, setValue] = useState("");
  const { handleUpdateSearchParam, handleRemoveSearchParam, isProcessing } =
    useCustomersTableContext();

  return (
    <div className="relative">
      <TextInput
        autoComplete="off"
        id="name"
        icon={() => <SearchIcon className="mr-2 size-4" />}
        placeholder="Search by name"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (value === "") {
              handleRemoveSearchParam("search", value);
            } else {
              handleUpdateSearchParam("search", value);
            }
          }
        }}
        value={value}
        disabled={isProcessing}
      />
      {value.length >= 1 && (
        <div className="absolute right-1 bottom-1">
          <Button
            color="light"
            outline
            size="xs"
            onClick={() => handleUpdateSearchParam("search", value)}
            disabled={isProcessing}
          >
            {isProcessing ? "Searching..." : "Search"}
          </Button>
        </div>
      )}
    </div>
  );
}

function TablePagination() {
  const {
    handleUpdateSearchParam,
    handleRemoveSearchParam,
    paginatedTotal,
    customersCount,
  } = useCustomersTableContext();
  const searchParams = useSearchParams();
  const perPage = Number(searchParams.get("per_page") ?? 10);
  const page = Number(searchParams.get("page") ?? 1);

  const numberOfPages = Math.ceil(paginatedTotal / perPage);

  const onPageChange = (page: number) => {
    if (page === 0 || page === 1)
      return handleRemoveSearchParam("page", searchParams.get("page") ?? "");

    handleUpdateSearchParam("page", page.toString());
  };

  return (
    <div className="flex flex-col items-center justify-end gap-4 p-4 pt-0 sm:flex-row lg:gap-6">
      {(customersCount ?? 0) >= 10 && (
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Dropdown inline label={perPage}>
            <DropdownItem
              onClick={() => handleUpdateSearchParam("per_page", "5")}
            >
              5
            </DropdownItem>
            <DropdownItem
              onClick={() => handleUpdateSearchParam("per_page", "10")}
            >
              10
            </DropdownItem>
            <DropdownItem
              onClick={() => handleUpdateSearchParam("per_page", "15")}
            >
              15
            </DropdownItem>
            <DropdownItem
              onClick={() => handleUpdateSearchParam("per_page", "20")}
            >
              20
            </DropdownItem>
          </Dropdown>
        </div>
      )}
      {numberOfPages > 1 && (
        <>
          <div className="hidden sm:block">
            <Pagination
              currentPage={page}
              totalPages={numberOfPages}
              onPageChange={onPageChange}
              showIcons
            />
          </div>
          <div className="sm:hidden">
            <Pagination
              layout="navigation"
              currentPage={page}
              totalPages={numberOfPages}
              onPageChange={onPageChange}
              showIcons
            />
          </div>
        </>
      )}
    </div>
  );
}

function ActionsCell({ row }: { row: ILocationCustomer }) {
  const [isManageCustomerDrawerOpen, setIsManageCustomerDrawerOpen] =
    useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    await DeleteLocationCustomer(row.location_id, row.id);
    router.refresh();
  };

  return (
    <>
      {isManageCustomerDrawerOpen && (
        <ManageCustomerDrawer
          isOpen={isManageCustomerDrawerOpen}
          setIsOpen={setIsManageCustomerDrawerOpen}
          customer={row}
        />
      )}
      <div className="relative hidden items-center gap-2 sm:flex">
        <Tooltip content="Settings">
          <span
            className="cursor-pointer text-lg text-gray-500 active:opacity-50 dark:text-gray-300"
            onClick={() => setIsManageCustomerDrawerOpen(true)}
          >
            <SettingsIcon />
          </span>
        </Tooltip>
        <Tooltip content="Delete">
          <ConfirmModal
            description={`Are you sure you want to remove ${row.full_name} from this location?`}
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
      </div>
      <div className="w-2 sm:hidden">
        <Dropdown
          label=""
          renderTrigger={() => <EllipsisVertical />}
          size="sm"
          dismissOnClick={false}
        >
          <DropdownItem onClick={() => setIsManageCustomerDrawerOpen(true)}>
            Settings
          </DropdownItem>
          <ConfirmModal
            description={`Are you sure you want to remove for ${row.full_name} from this location?`}
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

interface IColumn<RowData> {
  cellClassNames?: string;
  field?: string;
  header?: string;
  render: (arg: RowData) => ReactNode;
}

function Content() {
  const { customers } = useCustomersTableContext();

  const columns: IColumn<(typeof customers)[0]>[] = [
    {
      field: "name",
      header: "Name",
      render: (row) => (
        <div>
          <p>{row.full_name}</p>
          <p>{`${row.address ?? ""} ${row.city ?? ""} ${row.state ?? ""} ${row.postal_code ?? ""}`}</p>
        </div>
      ),
    },
    {
      cellClassNames: "w-0 text-nowrap hidden sm:table-cell",
      field: "email",
      header: "Email",
      render: (row) => row.email,
    },
    {
      cellClassNames: "w-0 text-nowrap hidden sm:table-cell",
      field: "phone",
      header: "Phone",
      render: (row) => row.phone,
    },
    {
      cellClassNames: "w-0 text-nowrap hidden sm:table-cell",
      field: "lead_source",
      header: "Lead Source",
      render: (row) => row.lead_source,
    },
    {
      cellClassNames: "w-0 text-nowrap hidden sm:table-cell",
      field: "disposition_status",
      header: "Status",
      render: (row) =>
        row.disposition_status
          ? DISPOSITION_STATUSES[
              row.disposition_status as DISPOSITION_STATUS_KEYS
            ].label
          : "",
    },
    {
      cellClassNames: "w-0 text-nowrap hidden sm:table-cell",
      field: "closer_id",
      header: "Closer",
      render: (row) => (row.closer_id ? "Closer Name" : "No Closer"),
    },
    {
      cellClassNames: "w-0",
      field: "actions",
      header: "",
      render: (row) => <ActionsCell row={row} />,
    },
  ];

  return (
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
              className={column.cellClassNames}
            >
              {column.header}
            </TableHeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {customers.map((employee) => (
          <TableRow
            key={employee.id}
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
                {column.render(employee)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TableActiveFilters() {
  const { handleRemoveSearchParam, paginatedTotal } =
    useCustomersTableContext();
  const { locationId, businessId } = useParams();
  const searchParams = useSearchParams();
  const { search, role, page, per_page } = Object.fromEntries(searchParams);
  const hasFilters = Array.from(searchParams.entries())?.length > 0;

  return (
    hasFilters && (
      <>
        <p className="px-4 font-light lg:px-6">
          <span className="font-bold">{paginatedTotal}</span> filtered results
        </p>
        <div className="flex flex-col gap-2 px-4 sm:flex-row sm:items-center lg:px-6">
          {search && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-gray-300 p-2 px-4">
              <span className="text-sm font-semibold text-gray-500">
                Search
              </span>
              <Badge
                color="gray"
                onClick={() => handleRemoveSearchParam("search", search)}
              >
                <div className="flex cursor-pointer items-center gap-2">
                  <p>{search}</p>
                  <CircleXIcon className="size-4 fill-gray-600 stroke-gray-100" />
                </div>
              </Badge>
            </div>
          )}
          {page && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-gray-300 p-2 px-4">
              <span className="text-sm font-semibold text-gray-500">Page</span>
              <Badge
                color="gray"
                onClick={() => handleRemoveSearchParam("page", page)}
              >
                <div className="flex cursor-pointer items-center gap-2">
                  <p>{page}</p>
                  <CircleXIcon className="size-4 fill-gray-600 stroke-gray-100" />
                </div>
              </Badge>
            </div>
          )}
          {per_page && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-gray-300 p-2 px-4">
              <span className="text-sm font-semibold text-gray-500">
                Per Page
              </span>
              <Badge
                color="gray"
                onClick={() =>
                  handleRemoveSearchParam("per_page", per_page.toString())
                }
              >
                <div className="flex cursor-pointer items-center gap-2">
                  <p>{per_page}</p>
                  <CircleXIcon className="size-4 fill-gray-600 stroke-gray-100" />
                </div>
              </Badge>
            </div>
          )}
          {role && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-gray-300 p-2 px-4">
              <span className="text-sm font-semibold text-gray-500">Role</span>
              <Badge
                color="gray"
                onClick={() => handleRemoveSearchParam("role", role)}
              >
                <div className="flex cursor-pointer items-center gap-2 capitalize">
                  <p>{role}</p>
                  <CircleXIcon className="size-4 fill-gray-600 stroke-gray-100" />
                </div>
              </Badge>
            </div>
          )}
          <Button
            color="red"
            outline
            size="sm"
            href={`/manage/${businessId}/location/${locationId}/customers`}
          >
            <div className="flex items-center gap-1 text-red-500">
              <Trash2Icon className="size-5" />
              Clear
            </div>
          </Button>
        </div>
      </>
    )
  );
}

export default function CustomersTable({
  customersCount,
  customers,
  paginatedTotal,
}: {
  customersCount: number | null;
  customers: ILocationCustomer[];
  paginatedTotal: number;
}) {
  return (
    <EmployeesTableProvider
      customers={customers}
      customersCount={customersCount}
      paginatedTotal={paginatedTotal}
    >
      <div
        id="customers-table"
        className="grid gap-4 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900"
      >
        <div className="p-2">
          <TableSearchFilter />
        </div>
        <TableActiveFilters />
        {customers?.length === 0 ? (
          <div className="px-4">
            <Alert color="failure" icon={() => <InfoIcon className="mr-2" />}>
              <span className="font-medium">No rows found!</span> If this is an
              error, get help.
            </Alert>
          </div>
        ) : (
          <Content />
        )}

        <TablePagination />
      </div>
    </EmployeesTableProvider>
  );
}
