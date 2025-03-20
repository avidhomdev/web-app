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

async function getJobStripeSessions({
  email,
  jobId,
}: {
  email: string;
  jobId: string;
}) {
  const { data = [], error } = await fetch(
    `${process.env.NEXT_PUBLIC_STRIPE_API_URL}/checkout/sessions?customer_details[email]=${email}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    },
  ).then((res) => res.json());

  if (error) throw new Error(error.message);

  return data.filter(
    (session: { metadata: { job_id: string } }) =>
      session.metadata.job_id === jobId,
  );
}

export default async function Page(props: {
  params: Promise<{ jobId: string }>;
}) {
  const params = await props.params;
  const { jobId = "" } = params;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("business_location_jobs")
    .select("*, customer: customer_id(*)")
    .eq("id", Number(jobId))
    .limit(1)
    .single();

  if (error) throw error;
  if (!data) throw new Error("No job found.");
  const sessions = await getJobStripeSessions({
    jobId,
    email: data.customer?.email || "",
  });

  return (
    <div className="grid gap-4 md:gap-6">
      <div className="ml-auto">
        <AddCreditCardPaymentDrawer customer={data.customer!} />
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
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>Amount</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell />
          </TableHead>
          <TableBody>
            {sessions.map(
              (session: {
                amount_total: number;
                created: string;
                id: string;
                payment_method_types: string[];
              }) => (
                <TableRow key={session.id}>
                  <TableCell>
                    {dayjs(session.created).format("MM/DD/YYYY")}
                  </TableCell>
                  <TableCell>
                    {formatAsCurrency(session.amount_total / 100)}
                  </TableCell>
                  <TableCell>{session.payment_method_types}</TableCell>
                  <TableCell className="w-0">Tools</TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
