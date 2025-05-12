"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import {
  initialFormState,
  TInitialFormState,
} from "@/constants/initial-form-state";

import { BUSINESS_PROFILE_ROLES } from "@/constants/business-profile-roles";
import { Avatar, Drawer, DrawerHeader, DrawerItems, Label, Select } from "flowbite-react";
import { UserCogIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { UpdateBusinessUser } from "./actions";
import { IUser } from "./page";

const FormFields = ({ defaultValues }: { defaultValues: IUser }) => {
  const { pending } = useFormStatus();

  return (
    <fieldset disabled={pending} className="grid gap-2 md:gap-4 lg:gap-6">
      <input
        type="hidden"
        name="business_id"
        value={defaultValues.business_id}
      />
      <input type="hidden" name="profile_id" value={defaultValues.profile_id} />
      <div className="flex items-center gap-2 rounded-sm border border-gray-100 bg-gray-50 p-4 dark:border-gray-500 dark:bg-gray-700">
        <Avatar>{defaultValues.profile?.full_name}</Avatar>
      </div>
      <div>
        <Label htmlFor="role" className="mb-2 block">
          Role
        </Label>
        <Select name="role" required defaultValue={defaultValues.role}>
          <option value="" disabled>
            Select a role
          </option>
          {Object.entries(BUSINESS_PROFILE_ROLES).map(([roleKey, role]) => (
            <option key={roleKey} value={roleKey}>
              {role.name}
            </option>
          ))}
        </Select>
      </div>
      <SubmitButton pendingText="Creating User">
        <UserCogIcon className="mr-2" />
        Update User
      </SubmitButton>
    </fieldset>
  );
};

type UpdateUserDrawerType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  user: IUser;
};

export default function UpdateUserDrawer({
  isOpen,
  setIsOpen,
  user,
}: UpdateUserDrawerType) {
  const router = useRouter();
  const handleClose = () => setIsOpen(false);
  const [state, action] = useActionState(
    UpdateBusinessUser<TInitialFormState>,
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
      <DrawerHeader
        title="Edit User"
        titleIcon={() => <UserCogIcon className="mr-2" />}
      />
      <DrawerItems>
        {state.error && (
          <div className="my-4">
            <ErrorAlert message={state.error} />
          </div>
        )}
        <form action={action}>
          <FormFields defaultValues={user} />
        </form>
      </DrawerItems>
    </Drawer>
  );
}
