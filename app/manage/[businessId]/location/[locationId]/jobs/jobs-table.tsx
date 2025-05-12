"use client";

import { ConfirmModal } from "@/components/confirm-modal";
import Linky from "@/components/linky";
import { LOCATION_JOB_STATUS } from "@/constants/location-job-status";
import { useBusinessContext } from "@/contexts/business";
import { useUserContext } from "@/contexts/user";
import { IJob } from "@/types/job";
import { Database, Tables } from "@/types/supabase";
import { formatAsCompactNumber, formatAsCurrency } from "@/utils/formatter";
import dayjs from "dayjs";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Datepicker,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  List,
  ListItem,
  Pagination,
  Popover,
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
  ChevronDownIcon,
  ChevronUpIcon,
  CircleXIcon,
  EllipsisVertical,
  InfoIcon,
  MessageCircleIcon,
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
import { DeleteJob } from "./actions";
import JobMessagesDrawer from "./job-messages-drawer";
import UpdateJobDrawer from "./update-job-drawer";
import pluralize from "@/utils/pluralize";

const JobsTableContext = createContext<{
  jobs: IJob[];
  jobsCount: number | null;
  handleUpdateSearchParam: (param: string, value: string) => void;
  handleRemoveSearchParam: (param: string, value?: string) => void;
  isProcessing: boolean;
  paginatedTotal: number;
  statusCounts: {
    [k: string]: number;
  };
}>({
  jobs: [],
  jobsCount: 0,
  handleUpdateSearchParam: () => null,
  handleRemoveSearchParam: () => null,
  isProcessing: false,
  paginatedTotal: 0,
  statusCounts: {
    new: 0,
    qualified: 0,
    nurturing: 0,
    "follow-up": 0,
    lost: 0,
    inactive: 0,
  },
});

function useJobsTableContext() {
  const context = useContext(JobsTableContext);
  if (context === undefined)
    throw new Error(
      "useJobsTableContext needs to used be in JobsTableContextProvider",
    );

  return context;
}

type TJobsTableProviderProps = PropsWithChildren & {
  jobsCount: number | null;
  paginatedTotal: number;
  jobs: IJob[];
  statusCounts: {
    [k: string]: number;
  };
};

function filterJobsBySearchParam(searchParam: string | null) {
  return (job: IJob) => {
    if (!searchParam) return true;
    const concatenatedProductNames =
      job.products?.map((product) => product.product.name) ?? [];
    const searchItemsArray = [
      job.full_name,
      job.address,
      job.city,
      job.state,
      job.postal_code,
      ...concatenatedProductNames,
    ];
    const searchableString = searchItemsArray.join(" ").toLowerCase();

    return searchableString.includes(searchParam.toLowerCase());
  };
}

function filterJobsByProductIdsParam(productsParam: string | null) {
  const productIdsArray = productsParam?.split(",");

  return (job: IJob) => {
    if (!productsParam) return true;

    return job.products?.some((p) =>
      productIdsArray?.includes(p.product_id.toString()),
    );
  };
}

function JobsTableProvider({
  children,
  jobs,
  jobsCount,
  paginatedTotal,
  statusCounts,
}: TJobsTableProviderProps) {
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
    (param: string, value?: string) => {
      setIsProcessing(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete(param, value);

      router.push(`${pathname}?${params.toString()}`);
      setIsProcessing(false);
    },
    [pathname, router, searchParams],
  );

  const filteredjobs = jobs
    .filter(filterJobsBySearchParam(searchParams.get("search")))
    .filter(filterJobsByProductIdsParam(searchParams.get("products")));

  const value = useMemo(
    () => ({
      jobs: filteredjobs,
      jobsCount,
      handleUpdateSearchParam,
      handleRemoveSearchParam,
      isProcessing,
      paginatedTotal,
      statusCounts,
    }),
    [
      filteredjobs,
      jobsCount,
      handleUpdateSearchParam,
      handleRemoveSearchParam,
      isProcessing,
      paginatedTotal,
      statusCounts,
    ],
  );

  return (
    <JobsTableContext.Provider value={value}>
      {children}
    </JobsTableContext.Provider>
  );
}

function TableSearchFilter() {
  const [value, setValue] = useState("");
  const { handleUpdateSearchParam, handleRemoveSearchParam, isProcessing } =
    useJobsTableContext();

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

function ProductFilter() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    business: { products },
  } = useBusinessContext();
  const searchParams = useSearchParams();
  const productsSearchParam = searchParams.get("products");
  const productsSearchParamArray = productsSearchParam?.split(",") ?? [];

  const { handleUpdateSearchParam, handleRemoveSearchParam, isProcessing } =
    useJobsTableContext();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="relative">
      <Dropdown
        color="light"
        dismissOnClick={false}
        label={
          productsSearchParamArray.length === 0
            ? "Select products"
            : `${productsSearchParamArray.length} Selected ${pluralize("Product", "Products", productsSearchParamArray.length)}`
        }
        theme={{
          content: twMerge(theme.dropdown.content, "max-h-60 overflow-y-auto"),
          floating: {
            target:
              "w-full [&>span]:justify-between [&>span]:w-full [&>span]:items-center",
          },
        }}
        enableTypeAhead={false}
      >
        <DropdownHeader>
          <TextInput
            autoComplete="off"
            disabled={isProcessing}
            icon={() => <SearchIcon className="mr-2 size-4" />}
            name="product-filter-search"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
            value={searchTerm}
          />
        </DropdownHeader>
        {filteredProducts.map((product) => (
          <DropdownItem
            as="label"
            className="flex cursor-pointer gap-2"
            htmlFor={product.id.toString()}
            key={product.id}
          >
            <Checkbox
              className="cursor-pointer"
              checked={productsSearchParamArray?.includes(
                product.id.toString(),
              )}
              id={product.id.toString()}
              name="products"
              onChange={() => {
                if (isProcessing) return;
                const newProductArray = productsSearchParamArray?.includes(
                  product.id.toString(),
                )
                  ? productsSearchParamArray.filter(
                      (id) => id != product.id.toString(),
                    )
                  : [...productsSearchParamArray, product.id.toString()];

                if (newProductArray.length === 0) {
                  handleRemoveSearchParam("products");
                } else {
                  handleUpdateSearchParam(
                    "products",
                    newProductArray.join(","),
                  );
                }
              }}
            />
            <span className="text-left">{product.name}</span>
          </DropdownItem>
        ))}
      </Dropdown>
    </div>
  );
}

function StatusTabFilters() {
  const {
    handleUpdateSearchParam,
    handleRemoveSearchParam,
    statusCounts,
    jobsCount,
  } = useJobsTableContext();

  const searchParams = useSearchParams();
  const hasStatusParam = searchParams.has("status");
  const statusParamValue = searchParams.get("status");

  return (
    <Tabs
      onActiveTabChange={(tab) => {
        if (tab === 0) {
          handleRemoveSearchParam("status", statusParamValue ?? "");
        } else {
          handleUpdateSearchParam(
            "status",
            Object.keys(LOCATION_JOB_STATUS)[tab - 1],
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
            <Badge color="lime">{formatAsCompactNumber(jobsCount ?? 0)}</Badge>
          </div>
        }
        active={!searchParams.has("status")}
      />
      {Object.entries(LOCATION_JOB_STATUS).map(([statusKey, status]) => (
        <TabItem
          key={status.name}
          title={
            <div className="flex items-center gap-2">
              <span>{status.name}</span>
              <Badge color={status.color}>
                {formatAsCompactNumber(
                  statusCounts[
                    statusKey as Database["public"]["Enums"]["location_job_status"]
                  ] ?? 0,
                )}
              </Badge>
            </div>
          }
          active={hasStatusParam && statusParamValue === statusKey}
        />
      ))}
    </Tabs>
  );
}

function DateRangeFilter() {
  const { handleUpdateSearchParam } = useJobsTableContext();

  return (
    <>
      <div>
        <Datepicker
          id="created_after"
          onChange={(date) =>
            handleUpdateSearchParam(
              "created_after",
              new Date(date ?? "").toLocaleDateString(),
            )
          }
        />
      </div>
      <div>
        <Datepicker
          id="created_before"
          onChange={(date) =>
            handleUpdateSearchParam(
              "created_before",
              new Date(date ?? "").toLocaleDateString(),
            )
          }
        />
      </div>
    </>
  );
}

function TablePagination() {
  const {
    handleUpdateSearchParam,
    handleRemoveSearchParam,
    paginatedTotal,
    jobsCount,
  } = useJobsTableContext();
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
      {(jobsCount ?? 0) >= 10 && (
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

function ActionsCell({ row }: { row: Tables<"business_location_jobs"> }) {
  const [isJobDrawerOpen, setIsJobDrawerOpen] = useState(false);
  const [isJobMessageDrawerOpen, setIsJobMessageDrawerOpen] = useState(false);
  const router = useRouter();
  const { user } = useUserContext();

  const isCreator =
    user.id === row.creator_id ||
    ["admin", "manager"].includes(user.location?.role ?? "");

  const handleDelete = async () => {
    await DeleteJob(row.id);
    router.refresh();
  };

  return (
    <>
      {isJobDrawerOpen && (
        <UpdateJobDrawer
          job={row}
          isOpen={isJobDrawerOpen}
          setIsOpen={setIsJobDrawerOpen}
        />
      )}
      {isJobMessageDrawerOpen && (
        <JobMessagesDrawer
          job={row}
          isOpen={isJobMessageDrawerOpen}
          setIsOpen={setIsJobMessageDrawerOpen}
        />
      )}
      <div className="relative hidden items-center gap-2 sm:flex">
        <Tooltip content="Messages">
          <span
            className="cursor-pointer text-lg text-gray-500 active:opacity-50 dark:text-gray-300"
            onClick={() => setIsJobMessageDrawerOpen(true)}
          >
            <MessageCircleIcon />
          </span>
        </Tooltip>
        {isCreator && (
          <>
            <Tooltip content="Settings">
              <span
                className="cursor-pointer text-lg text-gray-500 active:opacity-50 dark:text-gray-300"
                onClick={() => setIsJobDrawerOpen(true)}
              >
                <SettingsIcon />
              </span>
            </Tooltip>
            <Tooltip content="Delete">
              <ConfirmModal
                description={`Are you sure you want to remove JOB-${row.id}?`}
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
        )}
      </div>
      <div className="w-2 sm:hidden">
        <Dropdown
          label=""
          renderTrigger={() => <EllipsisVertical />}
          size="sm"
          dismissOnClick={false}
        >
          <DropdownItem onClick={() => setIsJobMessageDrawerOpen(true)}>
            Messages
          </DropdownItem>
          {isCreator && (
            <>
              <DropdownItem onClick={() => setIsJobDrawerOpen(true)}>
                Settings
              </DropdownItem>
              <ConfirmModal
                description={`Are you sure you want to remove for JOB-${row.id}?`}
                onConfirmClick={handleDelete}
                trigger={(toggle) => (
                  <DropdownItem onClick={toggle}>Delete</DropdownItem>
                )}
              />
            </>
          )}
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
  sortableKey?: string;
}

function Content() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort");
  const isSortAscending = sort?.includes("ascending");
  const { handleUpdateSearchParam } = useJobsTableContext();
  const { jobs } = useJobsTableContext();

  const columns: IColumn<(typeof jobs)[0]>[] = [
    {
      field: "name",
      header: "Name",
      render: (row) => (
        <Avatar
          theme={{
            root: { base: twMerge(theme.avatar.root.base, "justify-start") },
          }}
        >
          <div className="text-nowrap">
            <Linky
              href={`/manage/${row.business_id}/location/${row.business_location_id}/job/${row.id}`}
            >
              {row.full_name ?? "John Doe"}
            </Linky>
            <p className="text-xs text-gray-400">{`JOB-${row.id}${row.address ? ` at ${row.address}` : ""}`}</p>
          </div>
        </Avatar>
      ),
      sortableKey: "full_name",
    },
    {
      cellClassNames: "w-0 text-nowrap hidden lg:table-cell",
      field: "products",
      header: "Products",
      render: (row) => {
        const productsCopy = [...(row.products ?? [])];
        const displayProducts = productsCopy.splice(0, 1);

        return (
          <div>
            <span>{displayProducts.map((p) => p.product.name).join(", ")}</span>
            {productsCopy.length ? (
              <Popover
                trigger="hover"
                content={
                  <div className="p-2">
                    <small>
                      <b>More Products</b>
                    </small>
                    <List unstyled>
                      {productsCopy.map((p) => (
                        <ListItem key={p.product_id}>{p.product.name}</ListItem>
                      ))}
                    </List>
                  </div>
                }
              >
                <span className="text-primary-400 ml-1 cursor-pointer font-semibold">{`+${productsCopy.length}`}</span>
              </Popover>
            ) : null}
          </div>
        );
      },
    },
    {
      cellClassNames: "w-0 text-right hidden md:table-cell",
      field: "commission",
      header: "Commission",
      render: (row) => formatAsCurrency(row.commission),
      sortableKey: "commission",
    },
    {
      cellClassNames: "w-0 text-right hidden xl:table-cell",
      field: "lineitems",
      header: "Total",
      render: (row) => {
        const productsTotal = row.products?.reduce((dictionary, product) => {
          dictionary += Number(product.total_price);

          return dictionary;
        }, 0);

        return formatAsCurrency(Number(productsTotal));
      },
    },
    {
      cellClassNames: "w-0 text-nowrap hidden md:table-cell",
      field: "status",
      header: "Status",
      render: (row) => (
        <div className="flex">
          <Badge color={LOCATION_JOB_STATUS[row.status].color}>
            {LOCATION_JOB_STATUS[row.status].name}
          </Badge>
        </div>
      ),
    },
    {
      cellClassNames: "hidden xl:table-cell w-0 text-nowrap",
      field: "estimated_start_date",
      header: "Start Date",
      render: (row) => (
        <div>
          <p>
            {row.estimated_start_date
              ? dayjs(row.estimated_start_date).format("MMM DD, YYYY")
              : "Unknown"}
          </p>
        </div>
      ),
      sortableKey: "estimated_start_date",
    },
    {
      cellClassNames: "hidden xl:table-cell w-0 text-nowrap",
      field: "estimated_end_date",
      header: "End Date",
      render: (row) => (
        <div>
          <p>
            {row.estimated_end_date
              ? dayjs(row.estimated_end_date).format("MMM DD, YYYY")
              : "Unknown"}
          </p>
        </div>
      ),
      sortableKey: "estimated_end_date",
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
          {columns.map((column) => {
            const isSortedColumn = sort?.includes(column.sortableKey ?? "");
            const SortIcon =
              isSortAscending && isSortedColumn
                ? ChevronDownIcon
                : ChevronUpIcon;

            return (
              <TableHeadCell
                key={column.header}
                className={column.cellClassNames}
              >
                {Boolean(column.sortableKey) ? (
                  <div className="inline-flex items-center">
                    <span>{column.header}</span>
                    <SortIcon
                      className="ml-1 cursor-pointer text-gray-400 hover:scale-105"
                      onClick={() => {
                        handleUpdateSearchParam(
                          "sort",
                          `${column.sortableKey}__${isSortAscending ? "descending" : "ascending"}`,
                        );
                      }}
                    />
                  </div>
                ) : (
                  column.header
                )}
              </TableHeadCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {jobs.map((job) => (
          <TableRow
            key={job.id}
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
                {column.render(job)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TableActiveFilters() {
  const { productsDictionary } = useBusinessContext();
  const { handleRemoveSearchParam, handleUpdateSearchParam, paginatedTotal } =
    useJobsTableContext();
  const { locationId, businessId } = useParams();
  const searchParams = useSearchParams();
  const {
    created_after,
    created_before,
    page,
    per_page,
    products,
    search,
    source,
    status,
  } = Object.fromEntries(searchParams);

  const hasFilters =
    Object.values({
      created_after,
      created_before,
      page,
      per_page,
      products,
      search,
      source,
      status,
    }).join("").length > 0;

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
                onClick={() => handleRemoveSearchParam("search")}
              >
                <div className="flex cursor-pointer items-center gap-2">
                  <p>{search}</p>
                  <CircleXIcon className="size-4 fill-gray-600 stroke-gray-100" />
                </div>
              </Badge>
            </div>
          )}
          {status && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-gray-300 p-2 px-4">
              <span className="text-sm font-semibold text-gray-500">
                Status
              </span>
              <Badge
                color={
                  LOCATION_JOB_STATUS[
                    status as keyof typeof LOCATION_JOB_STATUS
                  ]?.color
                }
                onClick={() => handleRemoveSearchParam("status")}
              >
                <div className="flex cursor-pointer items-center gap-2">
                  <p>
                    {
                      LOCATION_JOB_STATUS[
                        status as keyof typeof LOCATION_JOB_STATUS
                      ]?.name
                    }
                  </p>
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
                onClick={() => handleRemoveSearchParam("page")}
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
                onClick={() => handleRemoveSearchParam("per_page")}
              >
                <div className="flex cursor-pointer items-center gap-2">
                  <p>{per_page}</p>
                  <CircleXIcon className="size-4 fill-gray-600 stroke-gray-100" />
                </div>
              </Badge>
            </div>
          )}
          {source && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-gray-300 p-2 px-4">
              <span className="text-sm font-semibold text-gray-500">
                Source
              </span>
              <Badge
                color="gray"
                onClick={() => handleRemoveSearchParam("source")}
              >
                <div className="flex cursor-pointer items-center gap-2 capitalize">
                  <p>{source}</p>
                  <CircleXIcon className="size-4 fill-gray-600 stroke-gray-100" />
                </div>
              </Badge>
            </div>
          )}
          {created_after && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-gray-300 p-2 px-4">
              <span className="text-sm font-semibold text-gray-500">
                Created after
              </span>
              <Badge
                color="gray"
                onClick={() => handleRemoveSearchParam("created_after")}
              >
                <div className="flex cursor-pointer items-center gap-2 capitalize">
                  <p>{created_after}</p>
                  <CircleXIcon className="size-4 fill-gray-600 stroke-gray-100" />
                </div>
              </Badge>
            </div>
          )}
          {created_before && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-gray-300 p-2 px-4">
              <span className="text-sm font-semibold text-gray-500">
                Created before
              </span>
              <Badge
                color="gray"
                onClick={() => handleRemoveSearchParam("created_before")}
              >
                <div className="flex cursor-pointer items-center gap-2 capitalize">
                  <p>{created_before}</p>
                  <CircleXIcon className="size-4 fill-gray-600 stroke-gray-100" />
                </div>
              </Badge>
            </div>
          )}
          {products && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-gray-300 p-2 px-4">
              <span className="text-sm font-semibold text-gray-500">
                Products
              </span>
              <div className="flex flex-wrap gap-4">
                {products.split(",").map((productId) => {
                  const productsSearchParamArray = products.split(",");

                  return (
                    <Badge
                      color="gray"
                      onClick={() => {
                        const newProductArray =
                          productsSearchParamArray?.includes(productId)
                            ? productsSearchParamArray.filter(
                                (id) => id != productId,
                              )
                            : [...productsSearchParamArray, productId];

                        if (newProductArray.length === 0) {
                          handleRemoveSearchParam("products");
                        } else {
                          handleUpdateSearchParam(
                            "products",
                            newProductArray.join(","),
                          );
                        }
                      }}
                      key={productId}
                    >
                      <div className="flex cursor-pointer items-center gap-2 capitalize">
                        <p>{productsDictionary[Number(productId)].name}</p>
                        <CircleXIcon className="size-4 fill-gray-600 stroke-gray-100" />
                      </div>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
          <Button
            color="red"
            outline
            size="sm"
            href={`/manage/${businessId}/location/${locationId}/jobs`}
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

export default function JobsTable({
  jobsCount,
  jobs,
  paginatedTotal,
  statusCounts,
}: {
  jobsCount: number | null;
  jobs: IJob[];
  paginatedTotal: number;
  statusCounts: {
    [k: string]: number;
  };
}) {
  return (
    <JobsTableProvider
      jobs={jobs}
      jobsCount={jobsCount}
      statusCounts={statusCounts}
      paginatedTotal={paginatedTotal}
    >
      <div
        id="jobs-table"
        className="grid gap-4 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900"
      >
        <div className="overflow-x-auto">
          <StatusTabFilters />
        </div>
        <div className="track grid gap-2 px-2 md:grid-cols-4 md:px-4 lg:gap-4 lg:px-6">
          <TableSearchFilter />
          <DateRangeFilter />
          <ProductFilter />
        </div>
        <TableActiveFilters />
        {jobs?.length === 0 ? (
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
    </JobsTableProvider>
  );
}
