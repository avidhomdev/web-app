"use client";

import { ConfirmModal } from "@/components/confirm-modal";
import { LOCATION_PROFILE_ROLES } from "@/constants/location_profile_roles";
import { Database } from "@/types/supabase";
import { formatAsCompactNumber } from "@/utils/formatter";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  Pagination,
  Select,
  TabItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Tabs,
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
import { DeleteBusinessUser } from "./actions";
import { IUser } from "./page";

import { BUSINESS_PROFILE_ROLES } from "@/constants/business-profile-roles";
import UpdateUserDrawer from "./update-user-drawer";
import { useBusinessContext } from "@/contexts/business";

const UsersTableContext = createContext<{
  users: IUser[];
  usersCount: number | null;
  handleUpdateSearchParam: (param: string, value: string) => void;
  handleRemoveSearchParam: (param: string, value: string) => void;
  isProcessing: boolean;
  paginatedTotal: number;
  roleCounts: {
    [k: string]: number;
  };
}>({
  users: [],
  usersCount: 0,
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

function useUsersTableContext() {
  const context = useContext(UsersTableContext);
  if (context === undefined)
    throw new Error(
      "useUsersTableContext needs to used be in UsersTableContextProvider",
    );

  return context;
}

type UsersTableProviderProps = PropsWithChildren & {
  usersCount: number | null;
  paginatedTotal: number;
  users: IUser[];
  roleCounts: {
    [k: string]: number;
  };
};

function UsersTableProvider({
  children,
  users,
  usersCount,
  roleCounts,
}: UsersTableProviderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { search, location_id } = Object.fromEntries(searchParams);

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

  const searchFilter = (item: IUser) =>
    search
      ? item.profile?.full_name?.toLowerCase().includes(search.toLowerCase())
      : true;

  const locationFilter = (item: IUser) => {
    return location_id
      ? item.profile?.locations.find(
          (location) => location.location_id === Number(location_id),
        )
      : true;
  };

  const filteredUsers = users.filter(searchFilter).filter(locationFilter);

  const value = useMemo(
    () => ({
      users: filteredUsers,
      usersCount,
      handleUpdateSearchParam,
      handleRemoveSearchParam,
      isProcessing,
      paginatedTotal: filteredUsers.length,
      roleCounts,
    }),
    [
      filteredUsers,
      usersCount,
      handleUpdateSearchParam,
      handleRemoveSearchParam,
      isProcessing,
      roleCounts,
    ],
  );

  return (
    <UsersTableContext.Provider value={value}>
      {children}
    </UsersTableContext.Provider>
  );
}

function TableSearchFilter() {
  const [value, setValue] = useState("");
  const { handleUpdateSearchParam, handleRemoveSearchParam, isProcessing } =
    useUsersTableContext();

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

function TableLocationFilter() {
  const {
    business: { locations },
  } = useBusinessContext();
  const searchParams = useSearchParams();
  const { handleUpdateSearchParam, handleRemoveSearchParam } =
    useUsersTableContext();

  return (
    <Select
      name="location_id"
      onChange={(e) => {
        if (e.target.value === "") {
          handleRemoveSearchParam(
            "location_id",
            searchParams.get("location_id") ?? "",
          );
        } else {
          handleUpdateSearchParam("location_id", e.target.value);
        }
      }}
      defaultValue={searchParams.get("location_id") ?? ""}
    >
      <option value="">Select a location</option>
      {locations.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </Select>
  );
}

function RoleTabFilter() {
  const {
    handleUpdateSearchParam,
    handleRemoveSearchParam,
    roleCounts,
    usersCount,
  } = useUsersTableContext();

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
      <TabItem
        title={
          <div className="flex items-center gap-2">
            All{" "}
            <Badge color="lime">{formatAsCompactNumber(usersCount ?? 0)}</Badge>
          </div>
        }
        active={!searchParams.has("role")}
      />
      {Object.entries(LOCATION_PROFILE_ROLES).map(([roleKey, role]) => (
        <TabItem
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
    usersCount,
  } = useUsersTableContext();
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
      {(usersCount ?? 0) >= 10 && (
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

function ActionsCell({ row }: { row: IUser }) {
  const [isUpdateEmployeeDrawerOpen, setIsUpdateEmployeeDrawerOpen] =
    useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    await DeleteBusinessUser(row.business_id, row.profile_id);
    router.refresh();
  };

  return (
    <>
      {isUpdateEmployeeDrawerOpen && (
        <UpdateUserDrawer
          isOpen={isUpdateEmployeeDrawerOpen}
          setIsOpen={setIsUpdateEmployeeDrawerOpen}
          user={row}
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
            matchStringConfirmation={row.profile?.full_name ?? undefined}
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
          <DropdownItem onClick={() => setIsUpdateEmployeeDrawerOpen(true)}>
            Settings
          </DropdownItem>
          <ConfirmModal
            matchStringConfirmation={row.profile?.full_name ?? undefined}
            description={`Are you sure you want to remove for ${row.profile?.full_name} from this location?`}
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
  const { users } = useUsersTableContext();

  const columns: IColumn<(typeof users)[0]>[] = [
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
      field: "locations",
      header: "Locations",
      render: (row) => {
        const locationNames = row.profile?.locations.flatMap(
          (location) => location.location.name,
        );

        return locationNames?.join(", ");
      },
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
        {users.map((employee) => (
          <TableRow
            key={employee.profile_id}
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
  const {
    business: { locations },
  } = useBusinessContext();
  const { handleRemoveSearchParam, paginatedTotal } = useUsersTableContext();
  const { businessId } = useParams();
  const searchParams = useSearchParams();
  const { search, role, page, per_page, location_id } =
    Object.fromEntries(searchParams);
  const hasFilters = Array.from(searchParams.entries())?.length > 0;

  const selectedLocation = locations.find(
    (location) => location?.id === Number(location_id),
  );

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
          {selectedLocation && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-gray-300 p-2 px-4">
              <span className="text-sm font-semibold text-gray-500">
                Location
              </span>
              <Badge
                color="gray"
                onClick={() =>
                  handleRemoveSearchParam("location_id", location_id)
                }
              >
                <div className="flex cursor-pointer items-center gap-2 capitalize">
                  <p>{selectedLocation.name}</p>
                  <CircleXIcon className="size-4 fill-gray-600 stroke-gray-100" />
                </div>
              </Badge>
            </div>
          )}
          <Button
            color="red"
            outline
            size="sm"
            href={`/manage/${businessId}/users`}
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

export default function UsersTable({
  usersCount,
  users,
  paginatedTotal,
  roleCounts,
}: {
  usersCount: number | null;
  users: IUser[];
  paginatedTotal: number;
  roleCounts: {
    [k: string]: number;
  };
}) {
  return (
    <UsersTableProvider
      users={users}
      usersCount={usersCount}
      roleCounts={roleCounts}
      paginatedTotal={paginatedTotal}
    >
      <div
        id="users-table"
        className="grid gap-4 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900"
      >
        <div className="overflow-x-auto">
          <RoleTabFilter />
        </div>
        <div className="track grid gap-4 px-4 md:grid-cols-3 lg:px-6">
          <div className="md:col-span-2">
            <TableSearchFilter />
          </div>
          <TableLocationFilter />
        </div>
        <TableActiveFilters />
        {users?.length === 0 ? (
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
    </UsersTableProvider>
  );
}
