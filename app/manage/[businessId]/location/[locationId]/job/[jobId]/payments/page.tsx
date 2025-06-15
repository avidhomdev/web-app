import { DAYJS_COMPACT_DATE } from "@/enums/dayjs-formats";
import { IJob } from "@/types/job";
import { formatAsCurrency } from "@/utils/formatter";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import {
  Badge,
  Button,
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
import { ReceiptIcon } from "lucide-react";

async function generateSignedUrls(
  paths: string[],
): Promise<Record<string, string>> {
  if (!paths || !paths.length) return {};
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from("business")
    .createSignedUrls(paths, 3600);
  if (error) throw error;

  return data.reduce<Record<string, string>>((acc, item) => {
    if (item.path) acc[item.path] = item.signedUrl;
    return acc;
  }, {});
}

interface StripeInvoice {
  hosted_invoice_url?: string;
  id: string;
  status: string;
  status_transitions: {
    paid_at: number;
  };
}

async function getJobStripeInvoices(jobId: string) {
  const { data = [] }: { data: StripeInvoice[] } = await fetch(
    `${process.env.NEXT_PUBLIC_STRIPE_API_URL}/invoices/search?query=metadata['job_id']:'${jobId}'`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  ).then((res) => res.json());

  const dictionary = data.reduce<Record<string, StripeInvoice>>(
    (acc, invoice) => {
      acc[invoice.id] = invoice;
      return acc;
    },
    {},
  );

  return dictionary;
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

  const stripeInvoices = await getJobStripeInvoices(jobId);

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
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Amount</TableHeadCell>
              <TableHeadCell>Received</TableHeadCell>
              <TableHeadCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.payments?.map(async (payment) => {
              const stripeInvoiceDetails = payment.stripe_invoice_id
                ? stripeInvoices[payment.stripe_invoice_id]
                : null;

              const paymentReceivedOn = stripeInvoiceDetails
                ? stripeInvoiceDetails.status_transitions.paid_at * 1000
                : payment.received_on;

              const signedUrl = payment.photo
                ? signedUrls[payment.photo]
                : null;
              const receiptUrl = stripeInvoiceDetails
                ? stripeInvoiceDetails.hosted_invoice_url
                : signedUrl;

              return (
                <TableRow key={payment.id}>
                  <TableCell>
                    {dayjs(payment.created_at).format("MM/DD/YYYY")}
                  </TableCell>
                  <TableCell>{payment.name}</TableCell>
                  <TableCell>{formatAsCurrency(payment.amount)}</TableCell>

                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      <Badge size="xs">{payment.type}</Badge>
                      <span className="text-xs">
                        {paymentReceivedOn
                          ? dayjs(paymentReceivedOn).format(DAYJS_COMPACT_DATE)
                          : "Not Received"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="w-0">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        color="alternative"
                        disabled={!receiptUrl}
                        href={receiptUrl ?? "#"}
                        size="sm"
                        title="View Receipt"
                      >
                        <ReceiptIcon />
                      </Button>
                      {payment.type !== "invoice" && (
                        <UpdatePaymentDrawer payment={payment} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
