"use client";

import SubmitButton from "@/components/submit-button";
import SupabaseFileUploadDropzone from "@/components/supabase-file-upload-dropzone";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { US_STATES } from "@/constants/us-states";
import { useUserContext } from "@/contexts/user";
import { Button, Card, Label, Select, TextInput } from "flowbite-react";
import { useParams } from "next/navigation";
import { useActionState } from "react";
import { UpdateProfile } from "./action";

function UpdateProfileInformation() {
  const { businessId } = useParams();
  const { user } = useUserContext();
  const [state, action] = useActionState(UpdateProfile<TInitialFormState>, {
    ...initialFormState,
    data: {
      business_id: businessId,
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
        <input
          type="hidden"
          name="business_id"
          value={state.data.business_id}
        />
        <Card>
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

export default function Page() {
  return (
    <div className="grid gap-6">
      <UpdateProfileInformation />
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <hgroup className="sm:col-span-3 md:col-span-4">
          <h2 className="font-semibold">Contact Information</h2>
          <p className="text-sm text-gray-400">
            Update your contact information
          </p>
        </hgroup>
        <div className="grid gap-6 sm:col-span-9 md:col-span-8">
          <Card>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Email
                </Label>
                <TextInput
                  autoComplete="off"
                  id="email"
                  name="email"
                  type="email"
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
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <hgroup className="sm:col-span-3 md:col-span-4">
          <h2 className="font-semibold">Update Password</h2>
          <p className="text-sm text-gray-400">
            Update your password to keep your account secure.
          </p>
        </hgroup>
        <div className="grid gap-6 sm:col-span-9 md:col-span-8">
          <Card>
            <div>
              <Label htmlFor="password" className="mb-2 block">
                Password
              </Label>
              <TextInput
                autoComplete="off"
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
                id="confirm_password"
                name="confirm_password"
              />
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
