export type DISPOSITION_STATUS_KEYS = keyof typeof DISPOSITION_STATUSES;
export const DISPOSITION_STATUSES = {
  NEW: {
    action: "warning",
    bg: "bg-background-warning  border-warning-300",
    color: "yellow",
    label: "New",
  },
  NO_SHOW: {
    action: "error",
    bg: "bg-background-error  border-error-300",
    color: "red",
    label: "No show",
  },
  CANCELLED_AT_DOOR: {
    action: "error",
    bg: "bg-background-error  border-error-300",
    color: "red",
    label: "Cancelled at door",
  },
  PITCHED_NOT_CLOSED: {
    action: "error",
    bg: "bg-background-error  border-error-300",
    color: "red",
    label: "Pitched Not Closed",
  },
  PITCHED_PENDING: {
    action: "info",
    bg: "bg-background-info  border-info-300",
    color: "blue",
    label: "Pitched Pending",
  },
  PITCHED_CLOSED: {
    action: "success",
    bg: "bg-background-success  border-success-300",
    color: "green",
    label: "Pitched Closed",
  },
  PITCHED_FOLLOW_UP: {
    action: "warning",
    bg: "bg-background-warning  border-warning-300",
    color: "yellow",
    label: "Pitched Follow Up",
  },
};
