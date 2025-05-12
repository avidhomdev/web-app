"use client";

import { Toast, ToastToggle } from "flowbite-react";
import { CheckIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

const TOAST_TYPES = {
  success: {
    Icon: CheckIcon,
    iconClassNames: `bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200`,
  },
};

type TToastTypes = keyof typeof TOAST_TYPES;

export default function AppToasts() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const isToast = params.has("toast_type");
  if (!isToast) return null;

  const toastType = (params.get("toast_type") as TToastTypes) ?? "success";

  const { Icon, iconClassNames } = TOAST_TYPES[toastType];

  return (
    <div className="fixed bottom-5 right-5">
      <Toast>
        <div
          className={twMerge(
            iconClassNames,
            "mr-4 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="text-sm font-normal">{params.get("message")}</div>
        <div
          className="ml-auto flex items-center space-x-2"
          onClick={() => router.push(pathname)}
        >
          <ToastToggle />
        </div>
      </Toast>
    </div>
  );
}
