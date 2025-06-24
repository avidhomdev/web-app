import { createSupabaseServerClient } from "@/utils/supabase/server";
import AvailabilitySelector from "./availability-selector";
import { notFound, redirect } from "next/navigation";

export type AvailabilityObjectType = Record<string, Record<number, boolean>>;

type BusinessProfileResponseType = {
  availability: AvailabilityObjectType;
};

export default async function Page({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  if (!user) return redirect(`/sign-in`);

  const { data, error: businessProfileError } = await supabase
    .from("business_profiles")
    .select("availability")
    .match({ profile_id: user.id, business_id: businessId })
    .limit(1)
    .maybeSingle()
    .overrideTypes<BusinessProfileResponseType>();

  if (businessProfileError) throw new Error(businessProfileError.message);
  if (!data) return notFound();

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <hgroup className="sm:col-span-3 md:col-span-4">
          <h2 className="font-semibold">Availability</h2>
          <p className="text-sm text-gray-400">
            Control the schedule you want to receive new appointments
          </p>
        </hgroup>
      </div>
      <div className="flex justify-center">
        <AvailabilitySelector availability={data.availability} />
      </div>
    </div>
  );
}
