"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { LOCATION_PROFILE_ROLES } from "@/constants/location_profile_roles";
import {
  Alert,
  Avatar,
  Drawer,
  Label,
  Select,
  TextInput,
} from "flowbite-react";
import { UserPlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useActionState,
  useCallback,
  useEffect,
} from "react";
import { SearchOrInviteUser } from "./actions";

type TSearchOrInviteUserDrawer = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SearchOrInviteUserDrawer({
  isOpen,
  setIsOpen,
}: TSearchOrInviteUserDrawer) {
  const router = useRouter();
  const { locationId, businessId } = useParams();
  const [state, action] = useActionState(
    SearchOrInviteUser<TInitialFormState>,
    {
      ...initialFormState,
      data: {
        avatar_url: "",
        business_id: businessId,
        email: "",
        full_name: "",
        id: "",
        inviting_new: false,
        is_closer: false,
        is_installer: false,
        is_contractor: false,
        is_setter: false,
        location_id: locationId,
        role: "",
      },
    },
  );

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  useEffect(() => {
    if (state.success) {
      router.refresh();
      if (state.dismiss) setIsOpen(() => false);
    }
  }, [state.success, state.dismiss, router, setIsOpen]);

  return (
    <Drawer open={isOpen} onClose={handleClose} position="right">
      <Drawer.Header
        title="Search or Invite User"
        titleIcon={() => <UserPlusIcon className="mr-2" />}
      />
      <Drawer.Items>
        <p className="mb-4 text-xs">
          Search for a user by email. If the user is found, you can select that
          user and their role. If no user is found, we can send them an invite
          to join the system.
        </p>
        {state.error && (
          <div className="my-4">
            <ErrorAlert message={state.error} />
          </div>
        )}
        <form action={action} className="grid gap-4">
          <input type="hidden" name="location_id" value={locationId} />
          <input type="hidden" name="business_id" value={businessId} />
          <input type="hidden" name="id" value={state.data.id ?? ""} />
          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={state.data.email}
              disabled={state.data?.id}
              id="email"
              name="email"
              placeholder="name@example.com"
              required
              type="email"
            />
          </div>
          {Boolean(state.data?.id) && (
            <>
              {state.data.id === "confirm-invite" ? (
                <>
                  <input type="hidden" name="inviting_new" value="yes" />
                  <input type="hidden" name="email" value={state.data.email} />
                  <Alert>
                    An invite will be sent to this email so they can join the
                    system.
                  </Alert>
                  <div>
                    <Label htmlFor="full_name" className="mb-2 block">
                      Full Name
                    </Label>
                    <TextInput
                      autoComplete="off"
                      defaultValue={state.data.full_name}
                      id="full_name"
                      name="full_name"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 rounded border border-gray-100 bg-gray-50 p-4 dark:border-gray-500 dark:bg-gray-700">
                  <Avatar>{state.data.full_name}</Avatar>
                  <input
                    type="hidden"
                    name="profile_id"
                    value={state.data.id}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="role" className="mb-2 block">
                  Role
                </Label>
                <Select
                  defaultValue={state.data.role}
                  key={state.data.role}
                  name="role"
                  required
                >
                  <option value="">Select a role</option>
                  {Object.entries(LOCATION_PROFILE_ROLES).map(
                    ([roleKey, role]) => (
                      <option key={roleKey} value={roleKey}>
                        {role.name}
                      </option>
                    ),
                  )}
                </Select>
              </div>
              <div>
                <Label htmlFor="is_setter" className="mb-2 block">
                  Setter
                </Label>
                <Select
                  defaultValue={state.data.is_setter ? "yes" : "no"}
                  key={state.data.is_setter}
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
                  defaultValue={state.data.is_closer ? "yes" : "no"}
                  key={state.data.is_closer}
                  name="is_closer"
                  required
                >
                  <option value="">Select a option</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="is_installer" className="mb-2 block">
                  Installer
                </Label>
                <Select
                  defaultValue={state.data.is_installer ? "yes" : "no"}
                  key={state.data.is_installer}
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
                  defaultValue={state.data.is_contractor ? "yes" : "no"}
                  key={state.data.is_contractor}
                  name="is_contractor"
                  required
                >
                  <option value="">Select a option</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </Select>
              </div>
            </>
          )}
          <div>
            <SubmitButton
              pendingText={
                state.data === "confirm-invite" ? "Sending..." : "Submitting..."
              }
            >
              {state.data === "confirm-invite" ? "Send Invite" : "Submit"}
            </SubmitButton>
          </div>
        </form>
      </Drawer.Items>
    </Drawer>
  );
}
