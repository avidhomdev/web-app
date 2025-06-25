"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import SupabaseFileUploadDropzone from "@/components/supabase-file-upload-dropzone";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { US_STATES } from "@/constants/us-states";
import { useUserContext } from "@/contexts/user";
import { Card, Label, Select, TextInput } from "flowbite-react";
import { useParams } from "next/navigation";
import { useActionState } from "react";
import { UpdateContact, UpdateProfile, UpdateUserPassword } from "./action";

function UpdateProfileInformationForm() {
  const { businessId } = useParams();
  const { user } = useUserContext();
  const [state, action] = useActionState(UpdateProfile<TInitialFormState>, {
    ...initialFormState,
    data: {
      avatar_url: user.avatar_url,
      full_name: user.full_name,
      username: user.username,
      profile_id: user.id,
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12">
      <hgroup className="sm:col-span-3 md:col-span-4">
        <h2 className="font-semibold">Public Information</h2>
        <p className="text-sm text-gray-400">Update your public information</p>
      </hgroup>
      <form action={action} className="grid gap-6 sm:col-span-9 md:col-span-8">
        <input type="hidden" name="profile_id" value={state.data.profile_id} />
        <Card>
          {state.error && (
            <div className="my-4">
              <ErrorAlert message={state.error} />
            </div>
          )}
          <div>
            <Label htmlFor="avatar_url" className="mb-2 block">
              Avatar
            </Label>
            <SupabaseFileUploadDropzone
              bucket="business"
              defaultPath={state.data.avatar_url || undefined}
              filePath={`${businessId}/profiles/${user.id}/avatars`}
              name="avatar_url"
            />
          </div>
          <div>
            <Label htmlFor="full_name" className="mb-2 block">
              Name
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={state.data.full_name ?? ""}
              id="full_name"
              name="full_name"
              type="text"
            />
          </div>
          <div>
            <Label htmlFor="username" className="mb-2 block">
              Username
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={state.data.username ?? ""}
              id="username"
              name="username"
              type="text"
            />
          </div>
          <div className="flex flex-row justify-end">
            <SubmitButton pendingText="Updating...">Update</SubmitButton>
          </div>
        </Card>
      </form>
    </div>
  );
}

function ContactInformationForm() {
  const { user } = useUserContext();
  const [state, action] = useActionState(UpdateContact<TInitialFormState>, {
    ...initialFormState,
    data: {
      address: user.address,
      address2: user.address2,
      state: user.state,
      postal_code: user.postal_code,
      city: user.city,
      phone: user.phone,
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12">
      <hgroup className="sm:col-span-3 md:col-span-4">
        <h2 className="font-semibold">Contact Information</h2>
        <p className="text-sm text-gray-400">Update your contact information</p>
      </hgroup>
      <form action={action} className="grid gap-6 sm:col-span-9 md:col-span-8">
        <input type="hidden" name="profile_id" value={user.id} />
        <Card>
          {state.error && (
            <div className="my-4">
              <ErrorAlert message={state.error} />
            </div>
          )}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="email" className="mb-2 block">
                Email <small className="text-gray-400">(Read Only)</small>
              </Label>
              <TextInput
                autoComplete="off"
                defaultValue={user.email}
                id="email"
                name="email"
                readOnly
                type="email"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2 block">
                Phone
              </Label>
              <TextInput
                autoComplete="off"
                defaultValue={state.data.phone || ""}
                id="phone"
                name="phone"
                placeholder="555-555-5555"
                type="text"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address" className="mb-2 block">
              Address
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={state.data.address || ""}
              id="address"
              name="address"
              placeholder="1234 Fake st"
              type="text"
            />
          </div>
          <div>
            <Label htmlFor="address2" className="mb-2 block">
              Address 2
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={state.data.address2 || ""}
              id="address2"
              name="address2"
              placeholder="Suite 300"
              type="text"
            />
          </div>
          <div>
            <Label htmlFor="city" className="mb-2 block">
              City
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={state.data.city || ""}
              id="city"
              name="city"
              placeholder="Denver"
              type="text"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="state" className="block">
                State
              </Label>
              <Select
                defaultValue={state.data.state || ""}
                name="state"
                id="state"
              >
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
                defaultValue={state.data.postal_code || ""}
                id="postal_code"
                name="postal_code"
                placeholder="84780"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <SubmitButton pendingText="Updating...">Update</SubmitButton>
          </div>
        </Card>
      </form>
    </div>
  );
}

function UpdatePasswordForm() {
  const { user } = useUserContext();
  const [state, action] = useActionState(
    UpdateUserPassword<TInitialFormState>,
    {
      ...initialFormState,
      data: {
        password: "",
        confirm_password: "",
      },
    },
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12">
      <hgroup className="sm:col-span-3 md:col-span-4">
        <h2 className="font-semibold">Update Password</h2>
        <p className="text-sm text-gray-400">
          Update your password to keep your account secure.
        </p>
      </hgroup>
      <form action={action} className="grid gap-6 sm:col-span-9 md:col-span-8">
        <input type="hidden" name="profile_id" value={user.id} />
        <Card>
          {state.error && (
            <div className="my-4">
              <ErrorAlert message={state.error} />
            </div>
          )}
          <div>
            <Label htmlFor="password" className="mb-2 block">
              New Password
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={state.data.password}
              id="password"
              name="password"
              type="text"
            />
          </div>
          <div>
            <Label htmlFor="confirm_password" className="mb-2 block">
              Confirm Password
            </Label>
            <TextInput
              autoComplete="off"
              defaultValue={state.data.confirm_password}
              id="confirm_password"
              name="confirm_password"
            />
          </div>
          <div className="flex flex-row justify-end">
            <SubmitButton pendingText="Updating...">Update</SubmitButton>
          </div>
        </Card>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <div className="grid gap-6">
      <UpdateProfileInformationForm />
      <ContactInformationForm />
      <UpdatePasswordForm />
    </div>
  );
}
