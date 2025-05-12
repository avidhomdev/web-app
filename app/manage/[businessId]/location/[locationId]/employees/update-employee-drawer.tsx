"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import {
  initialFormState,
  TInitialFormState,
} from "@/constants/initial-form-state";
import { LOCATION_PROFILE_ROLES } from "@/constants/location_profile_roles";

import { Avatar, Drawer, Label, Select, TextInput } from "flowbite-react";
import { UserCogIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { UpdateEmployee } from "./actions";
import { IEmployee } from "./page";

const FormFields = ({ defaultValues }: { defaultValues: IEmployee }) => {
  const { pending } = useFormStatus();

  return (
    <fieldset disabled={pending} className="grid gap-2 md:gap-4 lg:gap-6">
      <input
        type="hidden"
        name="location_id"
        value={defaultValues.location_id}
      />
      <input type="hidden" name="profile_id" value={defaultValues.profile_id} />
      <div className="flex items-center gap-2 rounded border border-gray-100 bg-gray-50 p-4 dark:border-gray-500 dark:bg-gray-700">
        <Avatar>{defaultValues.profile?.full_name}</Avatar>
      </div>
      <div>
        <Label htmlFor="role" className="mb-2 block">
          Role
        </Label>
        <Select
          id="role"
          name="role"
          required
          defaultValue={defaultValues.role}
        >
          <option value="" disabled>
            Select a role
          </option>
          {Object.entries(LOCATION_PROFILE_ROLES).map(([roleKey, role]) => (
            <option key={roleKey} value={roleKey}>
              {role.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="is_setter" className="mb-2 block">
          Setter
        </Label>
        <Select
          defaultValue={defaultValues.is_setter ? "yes" : "no"}
          id="is_setter"
          key={defaultValues.is_setter ? "yes" : "no"}
          name="is_setter"
          required
        >
          <option value="">Select a option</option>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="is_closer" className="mb-2 block">
          Closer
        </Label>
        <Select
          defaultValue={defaultValues.is_closer ? "yes" : "no"}
          id="is_closer"
          key={defaultValues.is_closer ? "yes" : "no"}
          name="is_closer"
          required
        >
          <option value="">Select a option</option>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="closer_priority" className="mb-2 block">
          Closer Priority
        </Label>
        <TextInput
          autoComplete="off"
          defaultValue={defaultValues.closer_priority}
          id="closer_priority"
          name="closer_priority"
          placeholder="name@example.com"
          required
          type="closer_priority"
        />
      </div>
      <div>
        <Label htmlFor="is_installer" className="mb-2 block">
          Installer
        </Label>
        <Select
          defaultValue={defaultValues.is_installer ? "yes" : "no"}
          id="is_installer"
          key={defaultValues.is_installer ? "yes" : "no"}
          name="is_installer"
          required
        >
          <option value="">Select a option</option>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="is_contractor" className="mb-2 block">
          Contractor
        </Label>
        <Select
          defaultValue={defaultValues.is_contractor ? "yes" : "no"}
          id="is_contractor"
          key={defaultValues.is_contractor ? "yes" : "no"}
          name="is_contractor"
          required
        >
          <option value="">Select a option</option>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </Select>
      </div>
      <SubmitButton pendingText="Creating User">
        <UserCogIcon className="mr-2" />
        Update Employee
      </SubmitButton>
    </fieldset>
  );
};

type UpdateEmployeeDrawerType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  employee: IEmployee;
};

export default function UpdateEmployeeDrawer({
  isOpen,
  setIsOpen,
  employee,
}: UpdateEmployeeDrawerType) {
  const router = useRouter();
  const handleClose = () => setIsOpen(false);
  const [state, action] = useActionState(
    UpdateEmployee<TInitialFormState>,
    initialFormState,
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      if (state.dismiss) setIsOpen(() => false);
    }
  }, [state.success, state.dismiss, router, setIsOpen]);

  return (
    <Drawer open={isOpen} onClose={handleClose} position="right">
      <Drawer.Header
        title="Edit Employee"
        titleIcon={() => <UserCogIcon className="mr-2" />}
      />
      <Drawer.Items>
        {state.error && (
          <div className="my-4">
            <ErrorAlert message={state.error} />
          </div>
        )}
        <form action={action}>
          <FormFields defaultValues={employee} />
        </form>
      </Drawer.Items>
    </Drawer>
  );
}
