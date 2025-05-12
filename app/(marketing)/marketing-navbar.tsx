"use client";

import {
  Button,
  createTheme,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";

export default function MarketingNavbar() {
  return (
    <header>
      <Navbar fluid>
        <NavbarBrand href="/">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            HOM
          </span>
        </NavbarBrand>
        <div className="flex items-center gap-3 lg:order-2">
          <Button
            color="gray"
            href="/sign-in"
            className="border-0 hover:bg-gray-50 focus:ring-gray-300 focus:outline-hidden dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
          >
            Log in
          </Button>
          <Button color="info" href="#">
            Get started
          </Button>
          <NavbarToggle theme={createTheme({ icon: "h-5 w-5 shrink-0" })} />
        </div>
        <NavbarCollapse
          theme={createTheme({
            list: "mt-4 flex flex-col lg:mt-0 lg:flex-row lg:space-x-8 lg:text-base lg:font-medium",
          })}
          className="lg:order-1"
        >
          <NavbarLink active href="#" className="rounded-lg">
            Home
          </NavbarLink>
          <NavbarLink href="#">Company</NavbarLink>
          <NavbarLink href="#">Features</NavbarLink>
          <NavbarLink href="#">Pricing</NavbarLink>
          <NavbarLink href="#">Contact</NavbarLink>
        </NavbarCollapse>
      </Navbar>
    </header>
  );
}
