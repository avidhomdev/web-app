import { createSupabaseServerClient } from "@/utils/supabase/server";
import AddTimeOffDrawer from "./add-time-off-drawer";
import TimeOffTable from "./time-off-table";

const TIME_OFF_TYPES = ["vacation", "sick", "other"];

export const metadata = {
  title: "Time Off",
};

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("business_appointments")
    .select("*")
    .in("type", TIME_OFF_TYPES);
  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="grid gap-6">
      <div className="flex gap-6 sm:flex-row sm:items-center">
        <hgroup className="grow">
          <h2 className="font-semibold">Time Off</h2>
          <p className="text-sm text-gray-400">
            Add time off to the calendar so you don&apos;t receive appointments
            while you&apos;re out
          </p>
        </hgroup>
        <AddTimeOffDrawer />
      </div>
      <TimeOffTable rows={data} />
    </div>
  );
}
