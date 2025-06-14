import { DAYJS_COMPACT_DATE } from "@/enums/dayjs-formats";
import { IJob } from "@/types/job";
import { formatAsCurrency } from "@/utils/formatter";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  theme,
} from "flowbite-react";
import { twMerge } from "tailwind-merge";
import AddCreditCardPaymentDrawer from "./add-credit-card-payment-drawer";
import AddManualPaymentDrawer from "./add-manual-payment-drawer";
import UpdatePaymentDrawer from "./update-payment-drawer";

async function generateSignedUrls(
  paths: string[],
): Promise<{ [k: string]: string }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from("business")
    .createSignedUrls(paths, 3600);
  if (error) throw error;

  return data.reduce<{ [k: string]: string }>((acc, item) => {
    if (item.path) acc[item.path] = item.signedUrl;
    return acc;
  }, {});
}

export default async function Page(props: {
  params: Promise<{ jobId: string }>;
}) {
  const params = await props.params;
  const { jobId = "" } = params;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("business_location_jobs")
    .select(
      "*, customer: customer_id(*), payments: business_location_job_payments(*)",
    )
    .eq("id", Number(jobId))
    .order("created_at", {
      ascending: false,
      referencedTable: "business_location_job_payments",
    })
    .limit(1)
    .single()
    .overrideTypes<IJob>();

  if (error) throw error;
  if (!data) throw new Error("No job found.");

  const photoPaths =
    data.payments?.flatMap((payment) => payment.photo ?? []) || [];
  const signedUrls = await generateSignedUrls(photoPaths || []);

  return (
    <div className="grid gap-4 md:gap-6">
      <div className="ml-auto flex flex-row items-center gap-x-2">
        <AddManualPaymentDrawer />
        <AddCreditCardPaymentDrawer customer={data.customer} />
      </div>
      <div
        id="payments-table"
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
            <TableRow>
              <TableHeadCell>Date</TableHeadCell>
              <TableHeadCell>Amount</TableHeadCell>
              <TableHeadCell>Type</TableHeadCell>
              <TableHeadCell>Received</TableHeadCell>
              <TableHeadCell>Receipt</TableHeadCell>
              <TableHeadCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.payments?.map(async (payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {dayjs(payment.created_at).format("MM/DD/YYYY")}
                </TableCell>
                <TableCell>{formatAsCurrency(payment.amount)}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell>
                  {payment.received_on
                    ? dayjs(payment.received_on).format(DAYJS_COMPACT_DATE)
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-x-2">
                    {payment.photo && signedUrls[payment.photo] && (
                      <a
                        href={signedUrls[payment.photo]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Receipt
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="w-0">
                  <UpdatePaymentDrawer payment={payment} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
