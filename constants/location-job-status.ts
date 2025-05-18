import { Database } from "@/types/supabase";

export type TLeadStatus = Database["public"]["Enums"]["location_job_status"];

export const LOCATION_JOB_STATUS: {
  [k in TLeadStatus]: {
    name: string;
    color: string;
  };
} = {
  new: { name: "New", color: "emerald" },
  scheduled: { name: "Scheduled", color: "cyan" },
  pending: { name: "Pending", color: "blue" },
  approved: { name: "Approved", color: "gray" },
  billed: { name: "Billed", color: "green" },
  canceled: { name: "Canceled", color: "red" },
  complete: { name: "Complete", color: "slate" },
};

export function getLocationJobStatusProperties(status: TLeadStatus) {
  return LOCATION_JOB_STATUS[status] || LOCATION_JOB_STATUS.new;
}
