"use client";

import SubmitButton from "@/components/submit-button";

import { useUserContext } from "@/contexts/user";
import { Button, Card, Label, Radio, Select, TextInput } from "flowbite-react";
import { HardHatIcon, Trash2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { useFormStatus } from "react-dom";

import { ConfirmModal } from "@/components/confirm-modal";
import ErrorAlert from "@/components/error-alert";
import JobProductsFormFields from "@/components/job-products-form-fields";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { JOB_LEAD_TYPES } from "@/constants/job-lead-types";
import { JOB_PROFILE_ROLES } from "@/constants/job-profile-roles";
import { US_STATES } from "@/constants/us-states";
import { ILocationEmployee } from "@/types/location";
import { Database, Tables } from "@/types/supabase";
import { useActionState, useEffect, useState } from "react";
import { AddJob } from "./action";

interface IEmployee {
  profile_id: string;
  role: string;
}

interface IFormFields {
  address: string;
  city: string;
  commission: string;
  down_payment_collected: number;
  email: string;
  employees: IEmployee[];
  estimated_end_date: string;
  estimated_start_date: string;
  full_name: string;
  has_water_rebate: "no" | "yes";
  hoa_approval_required: "no" | "yes";
  hoa_contact_email: string;
  hoa_contact_name: string;
  hoa_contact_phone: string;
  lead_type: string;
  payment_type: Database["public"]["Enums"]["job_payment_types"];
  phone: string;
  products: Omit<
    Tables<"business_location_job_products">,
    "created_at" | "id" | "job_id"
  >[];
  postal_code: string;
  state: string;
  water_rebate_company: string;
}

type TPageForm = {
  customer: Tables<"business_location_customers"> | null;
  profiles: ILocationEmployee[];
  products: Tables<"business_products">[];
};

const EmployeesCard = ({
  data,
  profiles,
}: {
  data: Pick<IFormFields, "employees">;
  profiles: ILocationEmployee[];
}) => {
  const [employees, setEmployees] = useState(() => data.employees);
  const { pending } = useFormStatus();

  return (
    <Card>
      <h2 className="text-xl font-medium text-gray-400">Employees</h2>
      {employees.length > 0 ? (
        <fieldset
          disabled={pending}
          className="grid gap-2 pb-2 sm:grid-cols-2 md:gap-6 md:pb-6"
        >
          {employees.map((employee, number) => (
            <div
              key={number.toString()}
              className="group relative grid gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="absolute right-4 top-4 hidden group-hover:block">
                <ConfirmModal
                  trigger={(toggle) => (
                    <Trash2Icon
                      className="size-4 cursor-pointer text-red-400 hover:size-5"
                      onClick={toggle}
                    />
                  )}
                  description="Are you sure you want to remove this employee?"
                  onConfirmClick={() =>
                    setEmployees((prevState) =>
                      prevState.filter((_, index) => index !== number),
                    )
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor={`employees__${number}__profile_id`}
                  className="mb-2 block"
                >
                  Employee
                </Label>
                <Select
                  defaultValue={employee.profile_id}
                  id={`employees__${number}__profile_id`}
                  key={employee.profile_id}
                  name={`employees__${number}__profile_id`}
                  required
                >
                  <option value="">Select an employee</option>
                  {profiles.map((profile) => (
                    <option key={profile.profile_id} value={profile.profile_id}>
                      {profile.profile?.full_name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label
                  htmlFor={`employees__${number}__role`}
                  className="mb-2 block"
                >
                  Role
                </Label>
                <Select
                  defaultValue={employee.role}
                  id={`employees__${number}__role`}
                  key={employee.role}
                  name={`employees__${number}__role`}
                  required
                >
                  <option value="">Select a role</option>
                  {Object.entries(JOB_PROFILE_ROLES).map(([roleKey, role]) => (
                    <option key={roleKey} value={roleKey}>
                      {role.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          ))}
        </fieldset>
      ) : (
        "No employees added to job."
      )}
      <div>
        <Button
          color="light"
          onClick={() =>
            setEmployees((prevState) => [
              ...prevState,
              { profile_id: "", role: "" },
            ])
          }
        >
          Add employee
        </Button>
      </div>
    </Card>
  );
};

const HOAInformationFields = ({
  data,
}: {
  data: Pick<
    IFormFields,
    | "hoa_approval_required"
    | "hoa_contact_email"
    | "hoa_contact_name"
    | "hoa_contact_phone"
  >;
}) => {
  const [isApprovalRequired, setIsApprovalRequired] = useState(false);
  const { pending } = useFormStatus();

  return (
    <Card>
      <h2 className="text-xl font-medium text-gray-400">HOA Information</h2>
      <fieldset
        disabled={pending}
        className="grid gap-2 pb-2 sm:grid-cols-2 md:gap-6 md:pb-6"
      >
        <fieldset className="flex max-w-md flex-col gap-4 sm:col-span-2">
          <legend className="mb-4">Approval Needed</legend>
          <div className="flex items-center gap-2">
            <Radio
              defaultChecked={data.hoa_approval_required === "yes"}
              id="yes"
              name="hoa_approval_required"
              onChange={(e) => setIsApprovalRequired(e.target.checked)}
              value="yes"
            />
            <Label htmlFor="yes">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio
              defaultChecked={data.hoa_approval_required === "no"}
              id="no"
              name="hoa_approval_required"
              onChange={(e) => setIsApprovalRequired(!e.target.checked)}
              value="no"
            />
            <Label htmlFor="no">No</Label>
          </div>
        </fieldset>
        {isApprovalRequired && (
          <>
            <div>
              <Label htmlFor="hoa_contact_name" className="mb-2 block">
                Contact Name
              </Label>
              <TextInput
                autoComplete="off"
                defaultValue={data.hoa_contact_name}
                id="hoa_contact_name"
                name="hoa_contact_name"
              />
            </div>
            <div>
              <Label htmlFor="hoa_contact_email" className="mb-2 block">
                Contact Email
              </Label>
              <TextInput
                autoComplete="off"
                defaultValue={data.hoa_contact_email}
                id="hoa_contact_email"
                name="hoa_contact_email"
                type="email"
              />
            </div>
            <div>
              <Label htmlFor="hoa_contact_phone" className="mb-2 block">
                Contact Phone
              </Label>
              <TextInput
                autoComplete="off"
                defaultValue={data.hoa_contact_phone}
                id="hoa_contact_phone"
                name="hoa_contact_phone"
                type="phone"
              />
            </div>
          </>
        )}
      </fieldset>
    </Card>
  );
};

const WaterRebateInformationFields = ({
  data,
}: {
  data: Pick<IFormFields, "water_rebate_company" | "has_water_rebate">;
}) => {
  const [isRebateProvided, setIsRebateProvided] = useState(false);
  const { pending } = useFormStatus();

  return (
    <Card>
      <h2 className="text-xl font-medium text-gray-400">
        Water Rebate Information
      </h2>
      <fieldset
        disabled={pending}
        className="grid gap-2 pb-2 sm:grid-cols-2 md:gap-6 md:pb-6"
      >
        <fieldset className="flex max-w-md flex-col gap-4 sm:col-span-2">
          <legend className="mb-4">Has Water Rebate</legend>
          <div className="flex items-center gap-2">
            <Radio
              defaultChecked={data.has_water_rebate === "yes"}
              id="yes"
              name="has_water_rebate"
              onChange={(e) => setIsRebateProvided(e.target.checked)}
              value="yes"
            />
            <Label htmlFor="yes">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio
              defaultChecked={data.has_water_rebate === "no"}
              id="no"
              name="has_water_rebate"
              onChange={(e) => setIsRebateProvided(!e.target.checked)}
              value="no"
            />
            <Label htmlFor="no">No</Label>
          </div>
        </fieldset>
        {isRebateProvided && (
          <>
            <div>
              <Label htmlFor="water_rebate_company" className="mb-2 block">
                Water Rebate Company
              </Label>
              <TextInput
                defaultValue={data.water_rebate_company}
                id="water_rebate_company"
                name="water_rebate_company"
                autoComplete="off"
              />
            </div>
          </>
        )}
      </fieldset>
    </Card>
  );
};

const FormFields = ({
  customer,
  data,
  profiles,
  products,
}: TPageForm & { data: IFormFields }) => {
  const { businessId, locationId } = useParams();
  const { user } = useUserContext();
  const { pending } = useFormStatus();
  const [leadType, setLeadType] = useState<string | null>(null);

  return (
    <>
      <input type="hidden" name="business_location_id" value={locationId} />
      <input type="hidden" name="business_id" value={businessId} />
      <input type="hidden" name="creator_id" value={user.id} />
      <Card>
        <h2 className="text-xl font-medium text-gray-400">
          Customer Information
        </h2>
        {customer ? (
          <div>
            <input type="hidden" name="customer_id" value={customer.id} />
            <input type="hidden" name="full_name" value={customer.full_name} />
            <input type="hidden" name="email" value={customer.email ?? ""} />
            <input type="hidden" name="phone" value={customer.phone ?? ""} />
            <p>
              <b>{customer.full_name}</b>
            </p>
            <p>{customer.email}</p>
          </div>
        ) : (
          <fieldset
            disabled={pending}
            className="grid gap-2 pb-2 sm:grid-cols-2 md:gap-6 md:pb-6"
          >
            <div>
              <Label htmlFor="full_name" className="mb-2 block">
                Full Name
              </Label>
              <TextInput
                autoComplete="off"
                defaultValue={data.full_name}
                id="full_name"
                name="full_name"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2 block">
                Phone
              </Label>
              <TextInput
                autoComplete="off"
                defaultValue={data.phone}
                id="phone"
                name="phone"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email
              </Label>
              <TextInput
                autoComplete="off"
                defaultValue={data.email}
                id="email"
                name="email"
                required
                type="email"
              />
            </div>
          </fieldset>
        )}
      </Card>
      <Card>
        <h2 className="text-xl font-medium text-gray-400">
          Location Information
        </h2>
        <fieldset
          disabled={pending}
          className="grid gap-2 pb-2 sm:grid-cols-2 md:gap-6 md:pb-6"
        >
          <div>
            <Label htmlFor="lead_type" className="mb-2 block">
              Lead Type
            </Label>
            <Select
              defaultValue={data.lead_type}
              key={data.lead_type}
              id="lead_type"
              name="lead_type"
              onChange={(e) => setLeadType(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a lead type
              </option>
              {Object.entries(JOB_LEAD_TYPES).map(([key, prop]) => (
                <option key={key} value={key}>
                  {prop.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address" className="mb-2 block">
              Address
            </Label>
            <TextInput
              autoComplete="off"
              id="address"
              name="address"
              required
              defaultValue={data.address}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2 sm:grid-cols-3 md:gap-6">
            <div>
              <Label htmlFor="city" className="mb-2 block">
                City
              </Label>
              <TextInput
                autoComplete="off"
                defaultValue={data.city}
                id="city"
                name="city"
                required
              />
            </div>
            <div>
              <Label htmlFor="state" className="mb-2 block">
                State
              </Label>
              <Select
                defaultValue={data.state}
                key={data.state}
                id="state"
                name="state"
                required
              >
                <option value="" disabled>
                  Select a state
                </option>
                {Object.entries(US_STATES).map(([abbr, name]) => (
                  <option key={abbr} value={abbr}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="postal_code" className="mb-2 block">
                Postal Code
              </Label>
              <TextInput
                autoComplete="off"
                id="postal_code"
                name="postal_code"
                required
                defaultValue={data.postal_code}
              />
            </div>
          </div>
        </fieldset>
      </Card>
      <Card>
        <h2 className="text-xl font-medium text-gray-400">
          Product Information
        </h2>
        <fieldset disabled={pending} className="grid gap-2 md:mt-2 md:gap-6">
          <JobProductsFormFields
            defaultCommission={Number(data.commission)}
            defaultJobProducts={data.products}
            key={data.products?.toString()}
            leadType={leadType}
            products={products}
          />
        </fieldset>
      </Card>
      <Card>
        <h2 className="text-xl font-medium text-gray-400">
          Estimated Timeline
        </h2>
        <fieldset
          disabled={pending}
          className="grid gap-2 pb-2 sm:grid-cols-2 md:gap-6 md:pb-6"
        >
          <div>
            <Label htmlFor="estimated_start_date" className="mb-2 block">
              Start date
            </Label>
            <TextInput
              type="date"
              defaultValue={data.estimated_start_date}
              id="estimated_start_date"
              name="estimated_start_date"
            />
          </div>
          <div>
            <Label htmlFor="estimated_end_date" className="mb-2 block">
              End date
            </Label>
            <TextInput
              type="date"
              id="estimated_end_date"
              name="estimated_end_date"
              defaultValue={data.estimated_end_date}
            />
          </div>
        </fieldset>
      </Card>
      <HOAInformationFields data={data} />
      <WaterRebateInformationFields data={data} />
      <EmployeesCard
        key={data.employees?.toString()}
        data={data}
        profiles={profiles}
      />
    </>
  );
};

export default function PageForm({ customer, profiles, products }: TPageForm) {
  const { user } = useUserContext();
  const [state, action] = useActionState(AddJob<TInitialFormState>, {
    ...initialFormState,
    data: {
      address: customer?.address ?? "",
      city: customer?.city ?? "",
      commission: "",
      down_payment_collected: 500,
      email: "",
      employees: [
        { profile_id: user.id, role: "closer" },
        ...(customer?.creator_id
          ? [
              {
                profile_id: customer.creator_id,
                role: "setter",
              },
            ]
          : []),
      ],
      estimated_end_date: null,
      estimated_start_date: null,
      full_name: "",
      has_water_rebate: "no",
      hoa_approval_required: "no",
      hoa_contact_email: "",
      hoa_contact_name: "",
      hoa_contact_phone: "",
      lead_type: customer?.creator_id ? "setter" : "self",
      payment_type: "",
      phone: customer?.phone ?? "",
      postal_code: customer?.postal_code ?? "",
      products: [],
      state: customer?.state ?? "",
      water_rebate_company: "",
    },
  });

  useEffect(() => {
    if (state.error) window.scrollTo(0, 0);
  }, [state.error]);

  return (
    <>
      {state.error && <ErrorAlert message={state.error} />}
      <form action={action} className="grid gap-4 sm:gap-6">
        <FormFields
          customer={customer}
          data={state.data}
          profiles={profiles}
          products={products}
        />
        <div>
          <SubmitButton pendingText="Creating Job">
            <HardHatIcon className="mr-2" />
            Create Job
          </SubmitButton>
        </div>
      </form>
    </>
  );
}
