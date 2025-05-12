"use client";

import { Tables } from "@/types/supabase";
import { formatAsCurrency } from "@/utils/formatter";
import {
  Button,
  createTheme,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { Trash2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

type TJobProduct = Omit<
  Tables<"business_location_job_products">,
  "created_at" | "id" | "job_id"
> & { id?: number };

export default function JobProductsFormFields({
  defaultCommission = 0,
  defaultJobProducts = [],
  leadType,
  products = [],
}: {
  defaultCommission?: number;
  defaultJobProducts?: TJobProduct[];
  leadType: string | null;
  products: Tables<"business_products">[];
}) {
  const includeLeadPrice = ["paid", "setter"].includes(leadType || "self");
  const { businessId, locationId } = useParams();
  const [commission, setCommission] = useState(() => defaultCommission);
  const [jobProducts, setJobProducts] = useState<TJobProduct[]>(
    () => defaultJobProducts,
  );

  const productDictionary = products.reduce<{
    [k: string]: Tables<"business_products">;
  }>((dictionary, product) => {
    dictionary[product.id] = product;

    return dictionary;
  }, {});

  const defaultProductRecord = {
    business_id: businessId as string,
    job_id: null,
    lead_price: 0,
    location_id: Number(locationId),
    number_of_units: 1,
    product_id: 0,
    total_price: 0,
    unit_price: 0,
  };

  const productsTotal = jobProducts?.reduce((dictionary, product) => {
    dictionary += Number(product.total_price);
    return dictionary;
  }, 0);

  const selectedProductIdsDictionary = jobProducts.map((p) => p.product_id);

  return (
    <Table
      key={leadType}
      striped
      theme={createTheme({
        body: { cell: { base: "p-2" } },
        head: { cell: { base: "p-2 bg-gray-50 dark:bg-gray-700" } },
      })}
    >
      <TableHead>
        <TableRow>
          <TableHeadCell className="hidden w-52 sm:table-cell">
            Product
          </TableHeadCell>
          <TableHeadCell className="hidden w-24 sm:table-cell">
            Units
          </TableHeadCell>
          <TableHeadCell className="hidden w-24 sm:table-cell">
            Unit Price
          </TableHeadCell>
          <TableHeadCell className="hidden w-24 sm:table-cell">
            Lead Price
          </TableHeadCell>
          <TableHeadCell className="hidden w-28 text-right sm:table-cell">
            Total
          </TableHeadCell>
          <TableHeadCell className="w-0" />
        </TableRow>
      </TableHead>
      <TableBody className="divide-y divide-gray-100 dark:divide-gray-600">
        {jobProducts.length === 0 && (
          <TableRow>
            <TableCell colSpan={6}>No Products.</TableCell>
          </TableRow>
        )}
        {jobProducts.map((jobProduct, index) => {
          const businessProduct = productDictionary[jobProduct.product_id];

          if (!businessProduct) {
            return (
              <TableRow key={jobProduct.product_id}>
                <TableCell>
                  <Select
                    autoFocus
                    defaultValue={jobProduct.product_id?.toString()}
                    id={`product__${index}__product_id`}
                    name={`product__${index}__product_id`}
                    onChange={(e) => {
                      setJobProducts((prevState) =>
                        prevState.map((old, idx) => {
                          if (idx !== index) return old;
                          const { min_units, lead_price, unit_price } =
                            productDictionary[e.target.value];

                          return {
                            ...old,
                            lead_price: Number(includeLeadPrice && lead_price),
                            number_of_units: min_units,
                            product_id: Number(e.target.value),
                            total_price:
                              (Number(unit_price) +
                                Number(includeLeadPrice && lead_price)) *
                              min_units,
                            unit_price: unit_price,
                          };
                        }),
                      );
                    }}
                  >
                    <option value="">Select a product</option>
                    {products.map((p) => (
                      <option
                        disabled={
                          selectedProductIdsDictionary?.includes(p.id) &&
                          jobProduct.product_id !== p.id
                        }
                        key={p.id}
                        value={p.id}
                      >
                        {p.name}
                      </option>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            );
          }

          return (
            <TableRow key={businessProduct.id}>
              <TableCell>
                {businessProduct.name}
                <input
                  name={`product__${index}__product_id`}
                  type="hidden"
                  value={businessProduct.id}
                />
              </TableCell>
              <TableCell>
                <TextInput
                  defaultValue={Number(jobProduct.number_of_units)}
                  name={`product__${index}__number_of_units`}
                  onChange={(e) => {
                    setJobProducts((prevState) =>
                      prevState.map((old, idx) => {
                        if (idx !== index) return old;

                        return {
                          ...old,
                          number_of_units: Number(e.target.value),
                          total_price:
                            Number(e.target.value) *
                            (Number(old.unit_price) +
                              Number(includeLeadPrice && old.lead_price)),
                        };
                      }),
                    );
                  }}
                  step={0.01}
                  type="number"
                />
              </TableCell>
              <TableCell>
                <TextInput
                  defaultValue={Number(jobProduct.unit_price)}
                  name={`product__${index}__unit_price`}
                  onChange={(e) => {
                    setJobProducts((prevState) =>
                      prevState.map((old, idx) => {
                        if (idx !== index) return old;

                        return {
                          ...old,
                          total_price:
                            Number(old.number_of_units) *
                            (Number(e.target.value) +
                              Number(includeLeadPrice && old.lead_price)),
                          unit_price: Number(e.target.value),
                        };
                      }),
                    );
                  }}
                  step={0.01}
                  type="number"
                />
              </TableCell>
              <TableCell>
                <TextInput
                  defaultValue={Number(jobProduct.lead_price)}
                  name={`product__${index}__lead_price`}
                  onChange={(e) => {
                    setJobProducts((prevState) =>
                      prevState.map((old, idx) => {
                        if (idx !== index) return old;

                        return {
                          ...old,
                          lead_price: Number(e.target.value),
                          total_price:
                            Number(old.number_of_units) *
                            (Number(old.unit_price) + Number(e.target.value)),
                        };
                      }),
                    );
                  }}
                  step={0.01}
                  type="number"
                />
              </TableCell>
              <TableCell className="text-right">
                <input
                  name={`product__${index}__total_price`}
                  type="hidden"
                  value={Number(jobProduct.total_price)}
                />
                {formatAsCurrency(Number(jobProduct.total_price))}
              </TableCell>
              <TableCell className="w-0 p-0">
                <Trash2Icon
                  className="cursor-pointer text-red-400 opacity-50 hover:opacity-100"
                  onClick={() =>
                    setJobProducts((prevState) =>
                      prevState.filter((_, i) => i !== index),
                    )
                  }
                />
              </TableCell>
            </TableRow>
          );
        })}
        {!jobProducts.find((jobProduct) => jobProduct.product_id === 0) && (
          <>
            <TableRow className="sm:hidden">
              <TableCell className="px-2">
                <Button
                  color="light"
                  onClick={() =>
                    setJobProducts((prevState) => [
                      ...prevState,
                      defaultProductRecord,
                    ])
                  }
                  size="sm"
                >
                  Add product
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="hidden sm:table-row">
              <TableCell colSpan={6}>
                <Button
                  color="light"
                  onClick={() =>
                    setJobProducts((prevState) => [
                      ...prevState,
                      defaultProductRecord,
                    ])
                  }
                  size="sm"
                >
                  Add product
                </Button>
              </TableCell>
            </TableRow>
          </>
        )}

        <TableRow className="hidden sm:table-row">
          <TableCell colSpan={4}>
            <p className="text-lg">Commission</p>
          </TableCell>
          <TableCell colSpan={2}>
            <TextInput
              name="commission"
              onChange={(e) => setCommission(Number(e.target.value))}
              value={commission}
            />
          </TableCell>
        </TableRow>
        <TableRow className="hidden sm:table-row">
          <TableCell
            className="text-right text-lg font-bold text-green-400"
            colSpan={6}
          >
            {formatAsCurrency(Number(productsTotal) + commission)}
          </TableCell>
        </TableRow>
        <TableRow className="sm:hidden">
          <TableCell className="px-2">
            <p className="text-lg">Commission</p>
            <TextInput
              key={commission}
              name="commission"
              onChange={(e) => setCommission(Number(e.target.value))}
              type="number"
              value={commission}
            />
          </TableCell>
        </TableRow>
        <TableRow className="sm:hidden">
          <TableCell className="text-right text-lg font-bold text-green-400">
            {formatAsCurrency(Number(productsTotal) + Number(commission))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
