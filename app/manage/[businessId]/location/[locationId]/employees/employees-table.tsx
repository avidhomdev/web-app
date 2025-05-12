"use client";

import { ConfirmModal } from "@/components/confirm-modal";
import { BUSINESS_PROFILE_ROLES } from "@/constants/business-profile-roles";
import { LOCATION_PROFILE_ROLES } from "@/constants/location_profile_roles";
import { Database } from "@/types/supabase";
import { formatAsCompactNumber } from "@/utils/formatter";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Dropdown,
  Pagination,
  Table,
  Tabs,
  TextInput,
  theme,
  Tooltip,
} from "flowbite-react";
import {
  CheckCircle2Icon,
  CircleXIcon,
  EllipsisVertical,
  InfoIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
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
import { DeleteLocationEmployee } from "./actions";
import { IEmployee } from "./page";
import UpdateEmployeeDrawer from "./update-employee-drawer";

const employeesTableContext = createContext<{
  employees: IEmployee[];
  employeesCount: number | null;
  handleUpdateSearchParam: (param: string, value: string) => void;
  handleRemoveSearchParam: (param: string, value: string) => void;
  isProcessing: boolean;
  paginatedTotal: number;
  roleCounts: {
    [k: string]: number;
  };
}>({
  employees: [],
  employeesCount: 0,
  handleUpdateSearchParam: () => null,
  handleRemoveSearchParam: () => null,
  isProcessing: false,
  paginatedTotal: 0,
  roleCounts: {
    admin: 0,
    manager: 0,
    base: 0,
  },
});

function useEmployeesTableContext() {
  const context = useContext(employeesTableContext);
  if (context === undefined)
    throw new Error(
      "useEmployeesTableContext needs to used be in employeesTableContextProvider",
    );

  return context;
}

type TEmployeesTableProviderProps = PropsWithChildren & {
  employeesCount: number | null;
  paginatedTotal: number;
  employees: IEmployee[];
  roleCounts: {
    [k: string]: number;
  };
};

function EmployeesTableProvider({
  children,
  employees,
  employeesCount,
  paginatedTotal,
  roleCounts,
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

  const filteredemployees = employees.filter((item) =>
    searchParams.get("search")
      ? item.profile?.full_name
          ?.toLowerCase()
          .includes(searchParams.get("search")?.toLowerCase() ?? "")
      : true,
  );

  const value = useMemo(
    () => ({
      employees: filteredemployees,
      employeesCount,
      handleUpdateSearchParam,
      handleRemoveSearchParam,
      isProcessing,
      paginatedTotal,
      roleCounts,
    }),
    [
      filteredemployees,
      employeesCount,
      handleUpdateSearchParam,
      handleRemoveSearchParam,
      isProcessing,
      paginatedTotal,
      roleCounts,
    ],
  );

  return (
    <employeesTableContext.Provider value={value}>
      {children}
    </employeesTableContext.Provider>
  );
}

function TableSearchFilter() {
  const [value, setValue] = useState("");
  const { handleUpdateSearchParam, handleRemoveSearchParam, isProcessing } =
    useEmployeesTableContext();

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
        <div className="absolute bottom-1 right-1">
          <Button
            color="light"
            outline
            size="xs"
            onClick={() => handleUpdateSearchParam("search", value)}
            isProcessing={isProcessing}
          >
            {isProcessing ? "Searching..." : "Search"}
          </Button>
        </div>
      )}
    </div>
  );
}

function RoleTabFilter() {
  const {
    handleUpdateSearchParam,
    handleRemoveSearchParam,
    roleCounts,
    employeesCount,
  } = useEmployeesTableContext();

  const searchParams = useSearchParams();
  const hasRoleParam = searchParams.has("role");
  const roleParamValue = searchParams.get("role");

  return (
    <Tabs
      onActiveTabChange={(tab) => {
        if (tab === 0) {
          handleRemoveSearchParam("role", roleParamValue ?? "");
        } else {
          handleUpdateSearchParam(
            "role",
            Object.keys(LOCATION_PROFILE_ROLES)[tab - 1],
          );
        }
      }}
      variant="underline"
      theme={{
        tablist: {
          base: twMerge(theme.tabs.tablist.base, "pt-1 pl-1 text-nowrap"),
          tabitem: {
            variant: {
              underline: {
                base: "font-light",
                active: {
                  on: twMerge(
                    theme.tabs.tablist.tabitem.variant.underline.active.on,
                    "text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400 focus:ring-primary-400 focus:ring-1 rounded-none",
                  ),
                },
              },
            },
          },
        },
        tabpanel: "hidden",
      }}
    >
      <Tabs.Item
        title={
          <div className="flex items-center gap-2">
            All{" "}
            <Badge color="lime">
              {formatAsCompactNumber(employeesCount ?? 0)}
            </Badge>
          </div>
        }
        active={!searchParams.has("role")}
      />
      {Object.entries(LOCATION_PROFILE_ROLES).map(([roleKey, role]) => (
        <Tabs.Item
          key={role.name}
          title={
            <div className="flex items-center gap-2">
              <span>{role.name}</span>
              <Badge color={role.color}>
                {formatAsCompactNumber(
                  roleCounts[
                    roleKey as Database["public"]["Enums"]["location_profile_roles"]
                  ] ?? 0,
                )}
              </Badge>
            </div>
          }
          active={hasRoleParam && roleParamValue === roleKey}
        />
      ))}
    </Tabs>
  );
}

function TablePagination() {
  const {
    handleUpdateSearchParam,
    handleRemoveSearchParam,
    paginatedTotal,
    employeesCount,
  } = useEmployeesTableContext();
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
      {(employeesCount ?? 0) >= 10 && (
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Dropdown inline label={perPage}>
            <Dropdown.Item
              onClick={() => handleUpdateSearchParam("per_page", "5")}
            >
              5
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleUpdateSearchParam("per_page", "10")}
            >
              10
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleUpdateSearchParam("per_page", "15")}
            >
              15
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleUpdateSearchParam("per_page", "20")}
            >
              20
            </Dropdown.Item>
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

function ActionsCell({ row }: { row: IEmployee }) {
  const [isUpdateEmployeeDrawerOpen, setIsUpdateEmployeeDrawerOpen] =
    useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    await DeleteLocationEmployee(row.location_id, row.profile_id);
    router.refresh();
  };

  return (
    <>
      {isUpdateEmployeeDrawerOpen && (
        <UpdateEmployeeDrawer
          isOpen={isUpdateEmployeeDrawerOpen}
          setIsOpen={setIsUpdateEmployeeDrawerOpen}
          employee={row}
        />
      )}
      <div className="relative hidden items-center gap-2 sm:flex">
        <Tooltip content="Settings">
          <span
            className="cursor-pointer text-lg text-gray-500 active:opacity-50 dark:text-gray-300"
            onClick={() => setIsUpdateEmployeeDrawerOpen(true)}
          >
            <SettingsIcon />
          </span>
        </Tooltip>
        <Tooltip content="Delete">
          <ConfirmModal
            description={`Are you sure you want to remove ${row.profile?.full_name} from this location?`}
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
          <Dropdown.Item onClick={() => setIsUpdateEmployeeDrawerOpen(true)}>
            Settings
          </Dropdown.Item>
          <ConfirmModal
            description={`Are you sure you want to remove for ${row.profile?.full_name} from this location?`}
            onConfirmClick={handleDelete}
            trigger={(toggle) => (
              <Dropdown.Item onClick={toggle}>Delete</Dropdown.Item>
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
  const { employees } = useEmployeesTableContext();

  const columns: IColumn<(typeof employees)[0]>[] = [
    {
      field: "name",
      header: "Name",
      render: (row) => (
        <Avatar
          theme={{
            root: { base: twMerge(theme.avatar.root.base, "justify-start") },
          }}
        >
          {row.profile?.full_name ?? "John Doe"}
        </Avatar>
      ),
    },
    {
      cellClassNames: "w-0 text-nowrap hidden sm:table-cell",
      field: "role",
      header: "Role",
      render: (row) => (
        <div className="flex">
          <Badge color={BUSINESS_PROFILE_ROLES[row.role].color}>
            {BUSINESS_PROFILE_ROLES[row.role].name}
          </Badge>
        </div>
      ),
    },
    {
      cellClassNames: "w-0 text-nowrap hidden sm:table-cell",
      field: "is_installer",
      header: "Installer",
      render: (row) => (row.is_installer ? <CheckCircle2Icon /> : null),
    },
    {
      cellClassNames: "w-0 text-nowrap hidden sm:table-cell",
      field: "is_contractor",
      header: "Contractor",
      render: (row) => (row.is_contractor ? <CheckCircle2Icon /> : null),
    },
    {
      cellClassNames: "w-0 text-nowrap hidden sm:table-cell",
      field: "is_setter",
      header: "Setter",
      render: (row) => (row.is_setter ? <CheckCircle2Icon /> : null),
    },
    {
      cellClassNames: "w-0 text-nowrap hidden sm:table-cell",
      field: "is_closer",
      header: "Closer",
      render: (row) =>
        row.is_closer ? (
          <Badge className="justify-center" icon={StarIcon} size="sm">
            {row.closer_priority}
          </Badge>
        ) : null,
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
      <Table.Head
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
        {columns.map((column) => (
          <Table.HeadCell key={column.header} className={column.cellClassNames}>
            {column.header}
          </Table.HeadCell>
        ))}
      </Table.Head>
      <Table.Body>
        {employees.map((employee) => (
          <Table.Row
            key={employee.profile_id}
            className="border-b border-dashed border-gray-200 dark:border-gray-700"
          >
            {columns.map((column) => (
              <Table.Cell
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
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

function TableActiveFilters() {
  const { handleRemoveSearchParam, paginatedTotal } =
    useEmployeesTableContext();
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
            href={`/manage/${businessId}/location/${locationId}/employees`}
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

export default function EmployeesTable({
  employeesCount,
  employees,
  paginatedTotal,
  roleCounts,
}: {
  employeesCount: number | null;
  employees: IEmployee[];
  paginatedTotal: number;
  roleCounts: {
    [k: string]: number;
  };
}) {
  return (
    <EmployeesTableProvider
      employees={employees}
      employeesCount={employeesCount}
      roleCounts={roleCounts}
      paginatedTotal={paginatedTotal}
    >
      <div
        id="employees-table"
        className="grid gap-4 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900"
      >
        <div className="overflow-x-auto">
          <RoleTabFilter />
        </div>
        <div className="track grid gap-4 px-4 md:grid-cols-5 lg:px-6">
          <TableSearchFilter />
        </div>
        <TableActiveFilters />
        {employees?.length === 0 ? (
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
