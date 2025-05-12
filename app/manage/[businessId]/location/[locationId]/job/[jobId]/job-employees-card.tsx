"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { JOB_PROFILE_ROLES } from "@/constants/job-profile-roles";
import { useLocationContext } from "@/contexts/location";
import { IJob } from "@/types/job";
import getInitials from "@/utils/get-initials";
import { Avatar, Card, Drawer, DrawerHeader, DrawerItems, Label, Select } from "flowbite-react";
import { SettingsIcon, Trash2Icon, UserPlus2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { AddJobProfile, DeleteJobProfile, UpdateJobProfile } from "./actions";
import { ConfirmModal } from "@/components/confirm-modal";
import { Tables } from "@/types/supabase";
import { twMerge } from "tailwind-merge";

function DrawerFormFields({
  job,
  profile,
}: {
  job: IJob;
  profile?: Tables<"business_location_job_profiles">;
}) {
  const { pending } = useFormStatus();
  const { location } = useLocationContext();

  return (
    <fieldset disabled={pending} className="grid gap-2 lg:gap-6">
      <input name="id" value={profile?.id ?? ""} type="hidden" />
      <input name="job_id" value={job.id} type="hidden" />
      <input name="business_id" value={job.business_id} type="hidden" />
      <input
        name="location_id"
        value={job.business_location_id}
        type="hidden"
      />
      <div>
        <Label htmlFor="profile_id" className="mb-2 block">
          Employee
        </Label>
        <Select
          name="profile_id"
          id="profile_id"
          defaultValue={profile?.profile_id ?? ""}
        >
          <option value="" disabled>
            Select a profile
          </option>
          {location.profiles.map((profile) => (
            <option key={profile.profile_id} value={profile.profile_id}>
              {profile.profile.full_name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="role" className="mb-2 block">
          Role
        </Label>
        <Select name="role" id="role" defaultValue={profile?.role ?? ""}>
          <option value="" disabled>
            Select a role
          </option>
          {Object.entries(JOB_PROFILE_ROLES).map(([roleKey, role]) => (
            <option key={roleKey} value={roleKey}>
              {role.name}
            </option>
          ))}
        </Select>
      </div>
      <SubmitButton pendingText="Saving employee...">
        Save Employees
      </SubmitButton>
    </fieldset>
  );
}

function AddDrawer({ job }: { job: IJob }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [state, action] = useActionState(
    AddJobProfile<TInitialFormState>,
    initialFormState,
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      if (state.dismiss) setIsOpen(() => false);
    }
  }, [state.success, state.dismiss, router, setIsOpen]);

  return (
    <>
      <div
        className="shrink-0 cursor-pointer rounded-full p-2 opacity-0 hover:bg-gray-100 group-hover:opacity-100 dark:hover:bg-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <UserPlus2Icon />
      </div>
      {isOpen && (
        <Drawer open={isOpen} onClose={() => setIsOpen(false)} position="right">
          <DrawerHeader
            title="Add employee"
            titleIcon={() => <UserPlus2Icon className="mr-2" />}
          />
          <DrawerItems>
            {state.error && (
              <div className="my-4">
                <ErrorAlert message={state.error} />
              </div>
            )}
            <form action={action} className="my-4">
              <DrawerFormFields job={job} />
            </form>
          </DrawerItems>
        </Drawer>
      )}
    </>
  );
}

function UpdateProfileDrawer({
  job,
  profile,
}: {
  job: IJob;
  profile?: Tables<"business_location_job_profiles">;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [state, action] = useActionState(
    UpdateJobProfile<TInitialFormState>,
    initialFormState,
  );

  useEffect(() => {
    if (state.success) {
      router.refresh();
      if (state.dismiss) setIsOpen(() => false);
    }
  }, [state.success, state.dismiss, router, setIsOpen]);

  return (
    <>
      <SettingsIcon
        className="cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <Drawer open={isOpen} onClose={() => setIsOpen(false)} position="right">
          <DrawerHeader
            title="Update employee"
            titleIcon={() => <UserPlus2Icon className="mr-2" />}
          />
          <DrawerItems>
            {state.error && (
              <div className="my-4">
                <ErrorAlert message={state.error} />
              </div>
            )}
            <form action={action} className="my-4">
              <DrawerFormFields job={job} profile={profile} />
            </form>
          </DrawerItems>
        </Drawer>
      )}
    </>
  );
}

export default function JobEmployeesCard({ job }: { job: IJob }) {
  const router = useRouter();
  return (
    <Card className="group">
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-lg font-semibold tracking-tighter">Employees</h6>
        <AddDrawer job={job} />
      </div>
      <div className="flex flex-col gap-2 lg:gap-4">
        {job.profiles?.map((profile) => {
          const profileJobRole = JOB_PROFILE_ROLES[profile.role] ?? {};
          return (
            <div
              className={twMerge(
                "group/profile flex items-center justify-between gap-2 border-l-4 bg-gray-50 p-4 dark:bg-gray-900",
                profileJobRole.borderColor,
              )}
              key={profile.id}
            >
              <Avatar
                color={profileJobRole.color}
                placeholderInitials={getInitials(
                  profile.profile.full_name ?? "",
                )}
              >
                <p className="font-light">{profile.profile.full_name}</p>
                <p className="text-sm font-semibold">{profileJobRole.name}</p>
              </Avatar>
              <div className="grid grid-cols-2 gap-2 opacity-0 group-hover/profile:opacity-100">
                <UpdateProfileDrawer job={job} profile={profile} />

                <ConfirmModal
                  description={`Are you sure you want to remove ${profile.profile.full_name} as a ${profileJobRole.name} on this job?`}
                  trigger={(toggle) => (
                    <Trash2Icon
                      className="cursor-pointer text-red-400"
                      onClick={toggle}
                    />
                  )}
                  onConfirmClick={async () => {
                    await DeleteJobProfile(profile.id);
                    router.refresh();
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
