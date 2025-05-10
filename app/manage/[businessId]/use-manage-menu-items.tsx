"use client";

import { useUserContext } from "@/contexts/user";
import {
  BoxIcon,
  CalendarIcon,
  HardHatIcon,
  HomeIcon,
  MapPinIcon,
  SettingsIcon,
  UserCircle2,
  UserIcon,
  UsersRoundIcon,
} from "lucide-react";

import { useParams, usePathname } from "next/navigation";

export default function useManageMenuItems() {
  const { user } = useUserContext();
  const { businessId, locationId } = useParams();
  const pathname = usePathname();

  const isBusinessManagement = ["manager", "admin"].includes(
    user.business?.role ?? "",
  );
  const isLocationManagement =
    isBusinessManagement ||
    ["manager", "admin"].includes(user.location?.role ?? "");

  if (!businessId) return [];

  const generateBusinessLink = (segment: string) =>
    `/manage/${businessId}/${segment}`;

  if (!locationId) {
    return [
      {
        href: generateBusinessLink("dashboard"),
        icon: HomeIcon,
        isActive: pathname === `/manage/${businessId}/dashboard`,
        name: "Dashboard",
      },
      {
        href: generateBusinessLink("locations"),
        icon: MapPinIcon,
        isActive: pathname === `/manage/${businessId}/locations`,
        name: "Locations",
      },
      {
        href: generateBusinessLink("products"),
        icon: BoxIcon,
        isActive: pathname === `/manage/${businessId}/products`,
        name: "Products",
      },
      ...(isBusinessManagement
        ? [
            {
              name: "Users",
              href: generateBusinessLink("users"),
              isActive: pathname === `/manage/${businessId}/users`,
              icon: UserCircle2,
            },
            {
              href: generateBusinessLink("settings"),
              icon: SettingsIcon,
              isActive: pathname === `/manage/${businessId}/settings`,
              name: "Settings",
            },
          ]
        : []),
    ];
  }

  const generateLocationLink = (segment: string = "") =>
    generateBusinessLink(`/location/${locationId}/${segment}`);

  return [
    {
      href: generateLocationLink(),
      icon: HomeIcon,
      isActive: pathname === `/manage/${businessId}/location/${locationId}`,
      name: "Dashboard",
    },
    {
      href: generateLocationLink("customers"),
      icon: UsersRoundIcon,
      isActive: pathname.startsWith(
        `/manage/${businessId}/location/${locationId}/customers`,
      ),
      name: "Customers",
    },
    {
      href: generateLocationLink("jobs"),
      icon: HardHatIcon,
      isActive: pathname.startsWith(
        `/manage/${businessId}/location/${locationId}/job`,
      ),
      name: "Jobs",
    },
    ...(isLocationManagement
      ? [
          {
            href: generateLocationLink("employees"),
            icon: UserIcon,
            isActive: pathname.startsWith(
              `/manage/${businessId}/location/${locationId}/employee`,
            ),
            name: "Employees",
          },
          {
            href: generateLocationLink("schedule"),
            icon: CalendarIcon,
            isActive: pathname.startsWith(
              `/manage/${businessId}/location/${locationId}/schedule`,
            ),
            name: "Schedule",
          },
        ]
      : []),
  ];
}
