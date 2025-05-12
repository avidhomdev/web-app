"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { JOB_PAYMENT_TYPES } from "@/constants/job-payment-types";
import { useUserContext } from "@/contexts/user";
import { IJob } from "@/types/job";
import { formatAsCurrency } from "@/utils/formatter";
import {
  Card,
  Drawer,
  DrawerHeader,
  DrawerItems,
  Label,
  List,
  ListItem,
  Radio,
  Select,
  TextInput,
} from "flowbite-react";
import { SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { UpdateJobAdditionalInformation } from "./actions";
import { JOB_LEAD_TYPES, TJobLeadTypes } from "@/constants/job-lead-types";

type TJobAdditionalInformationCard = {
  job: IJob;
};

function HOAFormFieldset({ job }: { job: IJob }) {
  const [isApprovalRequired, setIsApprovalRequired] = useState(
    job.hoa_approval_required,
  );
  return (
    <>
      <fieldset className="flex max-w-md flex-col gap-4">
        <legend className="mb-4">Approval Needed</legend>
        <div className="flex items-center gap-2">
          <Radio
            defaultChecked={isApprovalRequired}
            id="yes"
            name="hoa_approval_required"
            value="yes"
            onChange={(e) => setIsApprovalRequired(e.target.checked)}
          />
          <Label htmlFor="yes">Yes</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio
            defaultChecked={!isApprovalRequired}
            id="no"
            name="hoa_approval_required"
            value="no"
            onChange={(e) => setIsApprovalRequired(!e.target.checked)}
          />
          <Label htmlFor="no">No</Label>
        </div>
      </fieldset>
      {isApprovalRequired && (
        <>
          <div>
            <Label htmlFor="hoa_contact_name" className="mb-2 block">
              HOA Contact Name
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={job.hoa_contact_name ?? ""}
              id="hoa_contact_name"
              name="hoa_contact_name"
            />
          </div>
          <div>
            <Label htmlFor="hoa_contact_email" className="mb-2 block">
              HOA Contact Email
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={job.hoa_contact_email ?? ""}
              id="hoa_contact_email"
              name="hoa_contact_email"
              type="email"
            />
          </div>
          <div>
            <Label htmlFor="hoa_contact_phone" className="mb-2 block">
              HOA Contact Phone
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={job.hoa_contact_phone ?? ""}
              id="hoa_contact_phone"
              name="hoa_contact_phone"
              type="phone"
            />
          </div>
        </>
      )}
    </>
  );
}

function WaterRebateFormFieldset({ job }: { job: IJob }) {
  const [isRebateProvided, setIsRebateProvided] = useState(
    job.has_water_rebate,
  );
  return (
    <>
      <fieldset className="flex max-w-md flex-col gap-4">
        <legend className="mb-4">Has Water Rebate</legend>
        <div className="flex items-center gap-2">
          <Radio
            defaultChecked={isRebateProvided}
            id="yes"
            name="has_water_rebate"
            onChange={(e) => setIsRebateProvided(e.target.checked)}
            value="yes"
          />
          <Label htmlFor="yes">Yes</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio
            defaultChecked={!isRebateProvided}
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
              autoComplete="off"
              id="water_rebate_company"
              name="water_rebate_company"
              defaultValue={job.water_rebate_company ?? ""}
            />
          </div>
        </>
      )}
    </>
  );
}

function EditDrawerFormFields({ job }: { job: IJob }) {
  const { pending } = useFormStatus();
  const { user } = useUserContext();

  return (
    <fieldset disabled={pending} className="grid gap-2 sm:gap-4 lg:gap-6">
      <input name="profile_id" value={user.id} type="hidden" />
      <input name="job_id" value={job.id} type="hidden" />
      <input name="business_id" value={job.business_id} type="hidden" />
      <input
        name="location_id"
        value={job.business_location_id}
        type="hidden"
      />
      <div>
        <Label htmlFor="lead_type" className="mb-2 block">
          Lead Type
        </Label>
        <Select
          defaultValue={job.lead_type}
          key={job.lead_type}
          id="lead_type"
          name="lead_type"
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
      <div>
        <Label htmlFor="down_payment_collected" className="mb-2 block">
          Down payment collected
        </Label>
        <TextInput
          autoComplete="off"
          defaultValue={job.down_payment_collected ?? ""}
          id="down_payment_collected"
          name="down_payment_collected"
        />
      </div>
      <div>
        <Label htmlFor="payment_type" className="mb-2 block">
          Payment Type
        </Label>
        <Select
          name="payment_type"
          id="payment_type"
          defaultValue={job.payment_type}
        >
          <option value="">Select a payment type</option>
          {Object.entries(JOB_PAYMENT_TYPES).map(
            ([paymentTypeKey, paymentType]) => (
              <option key={paymentTypeKey} value={paymentTypeKey}>
                {paymentType.name}
              </option>
            ),
          )}
        </Select>
      </div>
      <HOAFormFieldset job={job} />
      <WaterRebateFormFieldset job={job} />
      <SubmitButton pendingText="Saving job...">
        <SettingsIcon className="mr-2" />
        Update Job
      </SubmitButton>
    </fieldset>
  );
}

function EditDrawer({ job }: { job: IJob }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [state, action] = useActionState(
    UpdateJobAdditionalInformation<TInitialFormState>,
    initialFormState,
  );

  useEffect(() => {
    if (state.success && state.dismiss) {
      setIsOpen(() => false);
    }
  }, [state.success, state.dismiss, router, setIsOpen]);

  return (
    <>
      <div
        className="shrink-0 cursor-pointer rounded-full p-2 opacity-0 hover:bg-gray-100 group-hover:opacity-100 dark:hover:bg-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <SettingsIcon />
      </div>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)} position="right">
        <DrawerHeader
          title="Update information"
          titleIcon={() => <SettingsIcon className="mr-2" />}
        />
        <DrawerItems>
          {state.error && (
            <div className="my-4">
              <ErrorAlert message={state.error} />
            </div>
          )}
          <form action={action} className="my-4">
            <EditDrawerFormFields job={job} />
          </form>
        </DrawerItems>
      </Drawer>
    </>
  );
}

export default function JobAdditionalInformationCard({
  job,
}: TJobAdditionalInformationCard) {
  return (
    <Card className="group">
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-lg font-semibold tracking-tighter">
          Additional Information
        </h6>
        <EditDrawer job={job} />
      </div>
      <List unstyled>
        <ListItem className="flex items-center justify-between gap-2">
          <dt>Lead type</dt>
          <dl className="capitalize">
            {JOB_LEAD_TYPES[job.lead_type as TJobLeadTypes]?.name}
          </dl>
        </ListItem>
        <ListItem className="flex items-center justify-between gap-2">
          <dt>Down payment collected</dt>
          <dl>{formatAsCurrency(Number(job.down_payment_collected))}</dl>
        </ListItem>
        <ListItem className="flex items-center justify-between gap-2">
          <dt>Payment Type</dt>
          <dl>{JOB_PAYMENT_TYPES[job.payment_type].name}</dl>
        </ListItem>
        {job.hoa_approval_required ? (
          <>
            <ListItem className="flex items-center justify-between gap-2">
              <dt>HOA Contact Name</dt>
              <dl>{job.hoa_contact_name}</dl>
            </ListItem>
            <ListItem className="flex items-center justify-between gap-2">
              <dt>HOA Contact Phone</dt>
              <dl>{job.hoa_contact_phone}</dl>
            </ListItem>
            <ListItem className="flex items-center justify-between gap-2">
              <dt>HOA Contact Email</dt>
              <dl>{job.hoa_contact_email}</dl>
            </ListItem>
          </>
        ) : (
          <ListItem className="flex items-center justify-between gap-2">
            <dt>HOA Required</dt>
            <dl>No</dl>
          </ListItem>
        )}
        {job.has_water_rebate ? (
          <ListItem className="flex items-center justify-between gap-2">
            <dt>Water Rebate Company</dt>
            <dl>{job.water_rebate_company}</dl>
          </ListItem>
        ) : (
          <ListItem className="flex items-center justify-between gap-2">
            <dt>Water Rebate</dt>
            <dl>No</dl>
          </ListItem>
        )}
      </List>
    </Card>
  );
}
