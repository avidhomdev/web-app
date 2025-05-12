"use client";

import { useSidebarContext } from "@/contexts/sidebar";
import {
  createTheme,
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  theme,
} from "flowbite-react";
import { twMerge } from "tailwind-merge";
import useManageMenuItems from "./use-manage-menu-items";

export default function ManageSidebar() {
  const menuItems = useManageMenuItems();
  const { isCollapsed } = useSidebarContext();
  return (
    <Sidebar
      collapsed={isCollapsed}
      aria-label="Manage Sidebar"
      theme={createTheme({
        root: {
          base: twMerge(
            theme.sidebar.root.base,
            "h-[calc(100vh-4rem)] hidden lg:block top-16 border-r border-gray-200 dark:border-gray-700 sticky z-20",
          ),
          inner: twMerge(theme.sidebar.root.inner, "bg-white"),
        },
      })}
    >
      <SidebarItems>
        <SidebarItemGroup>
          {menuItems.map((menuItem) => (
            <SidebarItem
              href={menuItem.href}
              icon={menuItem.icon}
              key={menuItem.name}
              active={menuItem.isActive}
            >
              {menuItem.name}
            </SidebarItem>
          ))}
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
