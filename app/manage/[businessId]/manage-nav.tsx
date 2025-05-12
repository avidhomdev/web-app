"use client";

import { useBusinessContext } from "@/contexts/business";
import { useSidebarContext } from "@/contexts/sidebar";
import { useUserContext } from "@/contexts/user";
import {
  Avatar,
  createTheme,
  DarkThemeToggle,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  theme,
  Tooltip,
} from "flowbite-react";
import {
  ChevronRightIcon,
  SidebarCloseIcon,
  SidebarOpenIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import useManageMenuItems from "./use-manage-menu-items";

export default function ManageNav() {
  const menuItems = useManageMenuItems();
  const {
    user: { full_name, businesses },
  } = useUserContext();

  const { business } = useBusinessContext();
  const { businessId, locationId } = useParams();
  const location = business.locations.find(
    (location) => location.id === Number(locationId),
  );

  const { toggle, isCollapsed } = useSidebarContext();
  const SidebarIcon = isCollapsed ? SidebarOpenIcon : SidebarCloseIcon;

  return (
    <Navbar
      fluid
      className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex grow items-center gap-2">
        <div className="hidden lg:contents">
          <Tooltip content={`${isCollapsed ? "Open" : "Close"} Sidebar`}>
            <button
              className="hidden cursor-pointer items-center px-2 lg:flex"
              onClick={toggle}
            >
              <SidebarIcon className="size-5" />
            </button>
          </Tooltip>
        </div>
        <div className="mr-4 flex items-center gap-2 rounded-sm border border-gray-200 bg-gray-50 px-4 py-2 md:mr-2 md:justify-center dark:border-gray-600 dark:bg-gray-700">
          <div className="hidden sm:contents">
            <Dropdown
              inline
              arrowIcon={false}
              label={business.name}
              color="light"
              className="z-20"
            >
              <DropdownHeader>Select a Business</DropdownHeader>
              {businesses?.map((userBusiness) => (
                <DropdownItem
                  key={userBusiness.id}
                  href={`/manage/${userBusiness.id}/dashboard`}
                >
                  {userBusiness.name}
                </DropdownItem>
              ))}
            </Dropdown>
            <ChevronRightIcon />
          </div>
          <Dropdown
            label={location?.name ?? "Select a location"}
            color="light"
            className="z-20"
            inline
          >
            <DropdownHeader>Select a Location</DropdownHeader>
            {business.locations?.map((businessLocation) => (
              <DropdownItem
                key={businessLocation.id}
                href={`/manage/${businessLocation.business_id}/location/${businessLocation.id}`}
              >
                {businessLocation.name}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      </div>
      <div className="ml-auto flex gap-2 md:order-2 md:ml-0 md:gap-4">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
          theme={createTheme({
            content: twMerge(theme.dropdown.content, "z-50"),
          })}
        >
          <DropdownHeader>
            <span className="block text-sm">{full_name}</span>
          </DropdownHeader>
          <DropdownItem href={`/manage/${businessId}/settings/profile`}>
            Profile
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem href="/auth/signout">Sign out</DropdownItem>
        </Dropdown>
        <NavbarToggle />
        <DarkThemeToggle className="hidden lg:block" />
      </div>
      <NavbarCollapse className="mr-4 lg:hidden">
        {menuItems.map((menuItem) => (
          <NavbarLink
            key={menuItem.name}
            href={menuItem.href}
            active={menuItem.isActive}
            theme={createTheme({ active: { on: "text-primary-400" } })}
          >
            {menuItem.name}
          </NavbarLink>
        ))}
      </NavbarCollapse>
    </Navbar>
  );
}
