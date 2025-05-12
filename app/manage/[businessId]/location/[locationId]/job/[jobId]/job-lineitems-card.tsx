"use client";

import ErrorAlert from "@/components/error-alert";
import JobProductsFormFields from "@/components/job-products-form-fields";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { useBusinessContext } from "@/contexts/business";
import { useUserContext } from "@/contexts/user";
import { IJob } from "@/types/job";
import { formatAsCurrency, formatAsReadableNumber } from "@/utils/formatter";
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { SettingsIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { UpdateJobProducts } from "./actions";

const JobLineitemsTable = ({ job }: { job: IJob }) => {
  const includeLeadPrice = ["paid", "setter"].includes(job.lead_type);
  const productsTotal = job.products?.reduce((dictionary, product) => {
    dictionary += Number(product.total_price);
    return dictionary;
  }, 0);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell className="px-2 sm:px-6">Product</TableHeadCell>
          <TableHeadCell className="hidden text-right sm:table-cell">
            Units
          </TableHeadCell>
          <TableHeadCell className="hidden text-right sm:table-cell">
            Per Unit
          </TableHeadCell>
          <TableHeadCell className="px-2 text-right sm:px-6">
            Total
          </TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y dark:divide-gray-600">
        {job.products?.map((jobProduct) => (
          <TableRow key={jobProduct.id}>
            <TableCell className="hidden px-2 sm:table-cell sm:px-6">
              <div>
                <div className="text-lg">{jobProduct.product.name}</div>
                <div className="text-sm">{`per ${jobProduct.product.unit}`}</div>
              </div>
            </TableCell>
            <TableCell className="px-2 sm:hidden sm:px-6">
              <div>
                <div className="text-base">{jobProduct.product.name}</div>
                <div className="text-sm">{`${formatAsReadableNumber(jobProduct.number_of_units)} ${jobProduct.product.unit} * ${formatAsCurrency(
                  Number(jobProduct.unit_price) +
                    Number(includeLeadPrice && jobProduct.lead_price),
                )}`}</div>
              </div>
            </TableCell>
            <TableCell className="hidden text-right sm:table-cell sm:text-base">
              {formatAsReadableNumber(jobProduct.number_of_units)}
            </TableCell>
            <TableCell className="hidden text-right sm:table-cell sm:text-base">
              {formatAsCurrency(
                Number(jobProduct.unit_price) +
                  Number(includeLeadPrice && jobProduct.lead_price),
              )}
            </TableCell>
            <TableCell className="px-2 text-right sm:px-4 sm:text-base">
              {formatAsCurrency(Number(jobProduct.total_price))}
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell className="px-2 sm:px-6">
            <p className="sm:text-lg">Commission</p>
          </TableCell>
          <TableCell className="px-2 text-right sm:hidden sm:px-6 sm:text-base">
            {formatAsCurrency(Number(job.commission))}
          </TableCell>
          <TableCell
            className="hidden text-right sm:table-cell sm:text-base"
            colSpan={4}
          >
            {formatAsCurrency(Number(job.commission))}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            className="hidden text-right font-bold text-green-400 sm:table-cell sm:text-lg"
            colSpan={5}
          >
            {formatAsCurrency(Number(productsTotal) + Number(job.commission))}
          </TableCell>
          <TableCell
            className="px-2 text-right text-lg font-bold text-green-400 sm:hidden sm:px-6"
            colSpan={2}
          >
            {formatAsCurrency(Number(productsTotal) + Number(job.commission))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const ManageLineitemsForm = ({
  close,
  job,
}: {
  close: () => void;
  job: IJob;
}) => {
  const [state, action] = useActionState(
    UpdateJobProducts<TInitialFormState>,
    initialFormState,
  );
  const { user } = useUserContext();
  const {
    business: { products },
  } = useBusinessContext();

  useEffect(() => {
    if (state.success) close();
  }, [state.success, close]);

  return (
    <>
      {state.error && (
        <div className="my-4">
          <ErrorAlert message={state.error} />
        </div>
      )}
      <form className="grid gap-4" action={action}>
        <input type="hidden" name="profile_id" value={user.id} />
        <input
          type="hidden"
          name="job_product_ids"
          value={job.products?.map((p) => p.id).join(", ")}
        />
        <input type="hidden" name="job_id" value={job.id} />
        <input type="hidden" name="business_id" value={job.business_id} />
        <input
          type="hidden"
          name="location_id"
          value={job.business_location_id}
        />
        <JobProductsFormFields
          defaultCommission={job.commission}
          defaultJobProducts={job.products}
          leadType={job.lead_type}
          products={products}
        />
        <div className="flex items-center gap-2">
          <SubmitButton pendingText="Saving...">Save</SubmitButton>
          <Button color="light" onClick={close}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default function JobLineitemsCard({ job }: { job: IJob }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="group">
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-lg font-semibold tracking-tighter">Products</h6>
        <div
          className="shrink-0 cursor-pointer rounded-full p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setIsEditing((prevState) => !prevState)}
        >
          <SettingsIcon />
        </div>
      </div>
      {isEditing ? (
        <ManageLineitemsForm job={job} close={() => setIsEditing(false)} />
      ) : (
        <JobLineitemsTable job={job} />
      )}
    </Card>
  );
}
