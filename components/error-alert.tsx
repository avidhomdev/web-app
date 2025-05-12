"use client";

import { Alert, theme } from "flowbite-react";
import { AlertCircleIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function ErrorAlert({ message }: { message: string }) {
  return (
    <Alert
      color="red"
      icon={() => <AlertCircleIcon className="mr-2 size-4 shrink-0" />}
      theme={{
        wrapper: twMerge(
          theme.alert.wrapper,
          "[&>div]:overflow-hidden break-words",
        ),
      }}
    >
      {message}
    </Alert>
  );
}
