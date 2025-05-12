import { US_STATES } from "@/constants/us-states";
import {
  Button,
  Card,
  Label,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
  theme,
} from "flowbite-react";
import { twMerge } from "tailwind-merge";

export default function Page() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <hgroup className="sm:col-span-3 md:col-span-4">
          <h2 className="font-semibold">Usage</h2>
          <p className="text-sm text-gray-400">
            Overview of current usage and billing cycle.
          </p>
        </hgroup>
        <div className="sm:col-span-9 md:col-span-8">
          <Card>
            <strong>Current billing cycle (Feb 1 - Feb 31, 2024)</strong>
            <Table
              theme={{
                head: {
                  cell: { base: twMerge(theme.table.head.cell.base, "p-2") },
                },
                body: {
                  cell: { base: twMerge(theme.table.body.cell.base, "p-2") },
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableHeadCell>Item</TableHeadCell>
                  <TableHeadCell className="text-right">Quantity</TableHeadCell>
                  <TableHeadCell className="text-right">
                    Unit Price
                  </TableHeadCell>
                  <TableHeadCell className="text-right">Price</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow className="border-b">
                  <TableCell>Starter Plan</TableCell>
                  <TableCell className="text-right">1</TableCell>
                  <TableCell className="text-right">$9.99</TableCell>
                  <TableCell className="text-right">$9.99</TableCell>
                </TableRow>
                <TableRow className="border-b">
                  <TableCell>Additional Users</TableCell>
                  <TableCell className="text-right">100</TableCell>
                  <TableCell className="text-right">$9.99</TableCell>
                  <TableCell className="text-right">$999.99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell className="text-right">Subtotal</TableCell>
                  <TableCell className="text-right">$1,009.98</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell className="text-right">Tax (7.7%)</TableCell>
                  <TableCell className="text-right">$77.76</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell />
                  <TableCell className="text-right font-semibold">
                    Total
                  </TableCell>
                  <TableCell className="text-right">$1,087.74</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <hgroup className="sm:col-span-3 md:col-span-4">
          <h2 className="font-semibold">Payment Methods</h2>
          <p className="text-sm text-gray-400">
            Update your billing address to match your payment method.
          </p>
        </hgroup>
        <div className="grid gap-6 sm:col-span-9 md:col-span-8">
          <Card>
            <div className="flex flex-row justify-end">
              <Button>Add Card</Button>
            </div>
            table of cards
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <hgroup className="sm:col-span-3 md:col-span-4">
          <h2 className="font-semibold">Billing Address</h2>
          <p className="text-sm text-gray-400">
            Update your billing address to match your payment method.
          </p>
        </hgroup>
        <div className="sm:col-span-9 md:col-span-8">
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
              <Label htmlFor="address2" className="mb-2 block">
                Address 2
              </Label>
              <TextInput
                autoComplete="off"
                id="address2"
                name="address2"
                placeholder="Suite 300"
                required
                type="text"
              />
            </div>
            <div>
              <Label htmlFor="city" className="mb-2 block">
                City
              </Label>
              <TextInput
                autoComplete="off"
                id="city"
                name="city"
                placeholder="Denver"
                required
                type="text"
              />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <Label htmlFor="state" className="block">
                  State
                </Label>
                <Select name="state">
                  <option value="">Select a state</option>
                  {Object.entries(US_STATES).map(([abbr, name]) => (
                    <option key={abbr} value={abbr}>
                      {name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="postal_code" className="block">
                  Postal code
                </Label>
                <TextInput
                  autoComplete="off"
                  id="postal_code"
                  name="postal_code"
                  placeholder="UT"
                  required
                  type="text"
                />
              </div>
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
