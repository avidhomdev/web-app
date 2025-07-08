import { DAYS_OF_WEEK } from "@/enums/days-of-week";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export function useLocationInstallers({
  businessId,
  locationId,
  range,
}: {
  businessId: string;
  locationId: number;
  range: { start: string; end: string };
}) {
  const [installers, setInstallers] = useState<
    { profile_id: string; full_name: string }[]
  >([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchRpc = () =>
      supabase
        .rpc("location_installers_available", {
          lid: locationId,
          start_timestamp: range.start,
          end_timestamp: range.end,
        })
        .then(({ data }) => {
          const installerProfileIds = (data ?? []).map(
            (installer) => installer.profile_id,
          );

          return supabase
            .from("business_profiles")
            .select("*")
            .eq("business_id", businessId)
            .in("profile_id", installerProfileIds)
            .then(({ data: installerProfiles }) => {
              const installerProfileDictionary = (
                installerProfiles ?? []
              ).reduce<Record<string, Tables<"business_profiles">>>(
                (agg, cur) => {
                  agg[cur.profile_id] = cur;
                  return agg;
                },
                {},
              );

              return data?.filter((installer) => {
                const businessProfile =
                  installerProfileDictionary[installer.profile_id];
                const availability = businessProfile.availability as Record<
                  string,
                  {
                    [key: number]: boolean;
                  }
                >;

                const selectedDayOfWeek =
                  Object.values(DAYS_OF_WEEK)[dayjs(range.start).get("day")];
                if (!availability) return;

                const daySlots = availability[selectedDayOfWeek];

                const hourDiff = dayjs(range.end).diff(
                  dayjs(range.start),
                  "hour",
                );

                const isStartHourAvailable = Boolean(
                  daySlots[dayjs(range.start).get("hour")],
                );
                const isEndHourAvailable = Boolean(
                  daySlots[dayjs(range.end).get("hour")],
                );

                const availabilityCheck = Array.from(
                  { length: hourDiff },
                  (_, i) => {
                    const checkStartHour = dayjs(range.start)
                      .add(i, "hour")
                      .get("hour");
                    const checkEndHour = dayjs(range.end)
                      .add(i, "hour")
                      .get("hour");
                    return daySlots[checkStartHour] && daySlots[checkEndHour];
                  },
                );

                const hasUnavailableSlots = availabilityCheck.filter((a) => !a);
                return (
                  (isStartHourAvailable && isEndHourAvailable) ||
                  hasUnavailableSlots.length === 0
                );
              });
            });
        })
        .then((i) => setInstallers(i ?? []));

    if (locationId && range.start && range.end) fetchRpc();
  }, [supabase, locationId, range.start, range.end, businessId]);

  return installers.reduce<InstallerReturnType>((dictionary, installer) => {
    dictionary[installer.profile_id] = installer;
    return dictionary;
  }, {});
}

export type InstallerReturnType = Record<
  string,
  { profile_id: string; full_name: string }
>;
