"use client";

import { useBusinessContext } from "@/contexts/business";
import { Button, Card, Label, TextInput } from "flowbite-react";

export default function Page() {
  const { business } = useBusinessContext();
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <hgroup className="sm:col-span-3 md:col-span-4">
          <h2 className="font-semibold">Public Information</h2>
          <p className="text-sm text-gray-400">
            Update your public information
          </p>
        </hgroup>
        <div className="grid gap-6 sm:col-span-9 md:col-span-8">
          <Card>
            <div>
              <Label htmlFor="name" className="mb-2 block">
                Business Name
              </Label>
              <TextInput
                autoComplete="off"
                defaultValue={business.name}
                id="name"
                name="name"
                required
                type="text"
              />
            </div>
            <div className="flex flex-row justify-end">
              <Button>Update</Button>
            </div>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <hgroup className="sm:col-span-3 md:col-span-4">
          <h2 className="font-semibold">Point of Contact</h2>
          <p className="text-sm text-gray-400">
            The point of contact is used if we need to reach out to you for any
            reason.
          </p>
        </hgroup>
        <div className="grid gap-6 sm:col-span-9 md:col-span-8">
          <Card>
            <div>
              <Label htmlFor="address" className="mb-2 block">
                Address
              </Label>
              <TextInput
                autoComplete="off"
                id="address"
                name="address"
                placeholder="1234 Fake st"
                required
                type="text"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2 block">
                Phone
              </Label>
              <TextInput
                autoComplete="off"
                id="phone"
                name="phone"
                placeholder="555-555-5555"
                required
                type="phone"
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email
              </Label>
              <TextInput
                autoComplete="off"
                id="email"
                name="email"
                placeholder="email@example.com"
                required
                type="email"
              />
            </div>
            <div className="flex flex-row justify-end">
              <Button>Update</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
