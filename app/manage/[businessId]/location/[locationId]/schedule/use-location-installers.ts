import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export function useLocationInstallers({
  locationId,
  range,
}: {
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
          if (data) setInstallers(data);
        });

    if (locationId && range.start && range.end) fetchRpc();
  }, [supabase, locationId, range.start, range.end]);

  return installers.reduce<InstallerReturnType>((dictionary, installer) => {
    dictionary[installer.profile_id] = installer;
    return dictionary;
  }, {});
}

export type InstallerReturnType = Record<
  string,
  { profile_id: string; full_name: string }
>;
