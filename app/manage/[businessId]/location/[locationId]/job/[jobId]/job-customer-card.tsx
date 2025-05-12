"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { useUserContext } from "@/contexts/user";
import { IJob } from "@/types/job";
import {
  Card,
  Drawer,
  DrawerHeader,
  DrawerItems,
  Label,
  List,
  ListItem,
  TextInput,
  Tooltip,
} from "flowbite-react";
import {
  EditIcon,
  MailIcon,
  PhoneCallIcon,
  PhoneIcon,
  SendIcon,
  UserPlus2Icon,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { UpdateJobCustomer } from "./actions";

type TJobCustomerCard = {
  job: IJob;
};

function EditDrawerFormFields({ job }: { job: IJob }) {
  const { pending } = useFormStatus();
  const { user } = useUserContext();
  return (
    <fieldset disabled={pending} className="grid gap-2 lg:gap-6">
      <input name="job_id" value={job.id} type="hidden" />
      <input name="business_id" value={job.business_id} type="hidden" />
      <input name="profile_id" value={user.id} type="hidden" />
      <div>
        <Label htmlFor="full_name" className="mb-2 block">
          Full Name
        </Label>
        <TextInput
          autoComplete="off"
          id="full_name"
          name="full_name"
          defaultValue={job.full_name}
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
          type="phone"
          defaultValue={job.phone ?? ""}
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
          type="email"
          defaultValue={job.email ?? ""}
        />
      </div>
      <SubmitButton pendingText="Updating customer...">
        <UserPlus2Icon className="mr-2" />
        Update Customer
      </SubmitButton>
    </fieldset>
  );
}

function EditDrawer({ job }: { job: IJob }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action] = useActionState(
    UpdateJobCustomer<TInitialFormState>,
    initialFormState,
  );

  useEffect(() => {
    if (state.success && state.dismiss) setIsOpen(() => false);
  }, [state.success, state.dismiss, setIsOpen]);

  return (
    <>
      <div
        className="shrink-0 cursor-pointer rounded-full p-2 opacity-0 hover:bg-gray-100 group-hover:opacity-100 dark:hover:bg-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <EditIcon />
      </div>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)} position="right">
        <DrawerHeader
          title="Update customer"
          titleIcon={() => <UserPlus2Icon className="mr-2" />}
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

export default function JobCustomerCard({ job }: TJobCustomerCard) {
  return (
    <Card className="group">
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-lg font-semibold tracking-tighter">Customer</h6>
        <EditDrawer job={job} />
      </div>
      <List unstyled>
        <ListItem className="flex items-center justify-between gap-2">
          <dt>Name</dt>
          <dl>{job.full_name}</dl>
        </ListItem>
        <ListItem className="group/phone flex items-center justify-between gap-2">
          <dt>Phone</dt>
          <dl>
            {job.phone ? (
              <Tooltip content={`Call ${job.phone}`} placement="left">
                <div className="flex cursor-pointer items-center gap-2">
                  <PhoneIcon className="size-5 group-hover/phone:hidden" />
                  <PhoneCallIcon className="hidden size-5 group-hover/phone:block" />
                  {job.phone}
                </div>
              </Tooltip>
            ) : (
              "NA"
            )}
          </dl>
        </ListItem>
        <ListItem className="group/email flex items-center justify-between gap-2">
          <dt>Email</dt>
          <dl>
            {job.email ? (
              <Tooltip content={`Email ${job.email}`} placement="left">
                <div className="flex cursor-pointer items-center gap-2">
                  <MailIcon className="size-5 group-hover/email:hidden" />
                  <SendIcon className="hidden size-5 group-hover/email:block" />
                  {job.email}
                </div>
              </Tooltip>
            ) : (
              "NA"
            )}
          </dl>
        </ListItem>
      </List>
    </Card>
  );
}
