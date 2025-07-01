import { createSupabaseServerClient } from "@/utils/supabase/server";
import AddTimeOffDrawer from "./add-time-off-drawer";
import TimeOffTable from "./time-off-table";
import { notFound } from "next/navigation";

const TIME_OFF_TYPES = ["vacation", "sick", "other"];

export const metadata = {
  title: "Time Off",
};

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return notFound();
  const { data, error } = await supabase
    .from("business_appointments")
    .select("*, profiles: business_appointment_profiles!inner(*)")
    .eq("business_appointment_profiles.profile_id", user.id)
    .in("type", TIME_OFF_TYPES)
    .order("start_datetime", { ascending: false });
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
