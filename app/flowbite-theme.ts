import { createTheme, theme } from "flowbite-react";
import { twMerge } from "tailwind-merge";

export const customTheme = createTheme({
  button: {
    color: {
      primary:
        "border border-primary-600 bg-primary-500 text-white focus:ring-4 focus:ring-primary-600 enabled:hover:bg-primary-400 dark:border-primary-600 dark:bg-primary-600 dark:focus:ring-primary-700 dark:enabled:hover:border-primary-700 dark:enabled:hover:bg-primary-700",
      emerald:
        "border border-emerald-300 bg-white text-emerald-900 focus:ring-4 focus:ring-emerald-300 enabled:hover:bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-600 dark:text-white dark:focus:ring-emerald-700 dark:enabled:hover:border-emerald-700 dark:enabled:hover:bg-emerald-700",
      slate:
        "border border-slate-600 bg-slate-500 text-white focus:ring-4 focus:ring-slate-600 enabled:hover:bg-slate-400 dark:border-slate-600 dark:bg-slate-600 dark:focus:ring-slate-700 dark:enabled:hover:border-slate-700 dark:enabled:hover:bg-slate-700",
    },
  },
  badge: {
    root: {
      color: {
        emerald:
          "bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200 dark:bg-emerald-200 dark:text-emerald-900 dark:group-hover:bg-emerald-300",
        slate:
          "bg-slate-100 text-slate-800 group-hover:bg-slate-200 dark:bg-slate-200 dark:text-slate-900 dark:group-hover:bg-slate-300",
      },
    },
  },
  card: {
    root: {
      base: "rounded-xl border border-gray-100 bg-white shadow-lg shadow-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900",
      children: "flex h-full flex-col gap-4 p-6",
    },
  },
  tabs: {
    tablist: {
      base: twMerge(theme.tabs.tablist.base, "pt-1 pl-1"),
      variant: {
        underline: twMerge(theme.tabs.tablist.variant.underline, "flex-nowrap"),
      },
    },
  },
});
