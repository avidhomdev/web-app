import PageHeaderWithActions from "@/components/page-header-with-actions";
import { SHORT_FRIENDLY_DATE_TIME_FORMAT } from "@/enums/dayjs-formats";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { Card } from "flowbite-react";

export default async function Page({
  params,
}: {
  params: Promise<{ locationId: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const { locationId } = await params;
  const { data, error } = await supabase
    .from("business_appointments")
    .select(
      "*, customer: customer_id(*), profiles: business_appointment_profiles!inner(*, profile: profile_id(*))",
    )
    .eq("location_id", Number(locationId));

  if (error) throw new Error(error.message);

  return (
    <div className="relative container flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <PageHeaderWithActions
        title="Appointments"
        subtitle="View all of your appointments."
      />
      {data.map((appointment) => (
        <Card key={appointment.id}>
          <p>
            <b>{appointment.customer?.full_name}</b>
            <br />
            {`${appointment.customer?.address || "No address."}, ${appointment.customer?.city || "No city."}`}
          </p>
          <ul>
            <li>{`Start: ${dayjs(appointment.start_datetime).format(SHORT_FRIENDLY_DATE_TIME_FORMAT)}`}</li>
            <li>{`End: ${dayjs(appointment.end_datetime).format(SHORT_FRIENDLY_DATE_TIME_FORMAT)}`}</li>
            <li>{`Attendees: ${appointment.profiles.map((p) => p.profile.full_name).join(", ")} `}</li>
          </ul>
        </Card>
      ))}
    </div>
  );
}
