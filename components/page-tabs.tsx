import Link from "next/link";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type TTab = PropsWithChildren<{
  href: string;
  active?: boolean;
}>;

function Tab({ children, href, active }: TTab) {
  return (
    <li className="me-2">
      <Link
        href={href}
        className={twMerge(
          active
            ? "border-primary-600 text-primary-600 hover:border-primary-600"
            : "hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300",
          "inline-block border-b-2 border-transparent p-4",
        )}
      >
        {children}
      </Link>
    </li>
  );
}

export default function PageTabs({ children }: PropsWithChildren) {
  return (
    <div className="border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
      <ul className="-mb-px flex flex-wrap">{children}</ul>
    </div>
  );
}

PageTabs.Tab = Tab;
