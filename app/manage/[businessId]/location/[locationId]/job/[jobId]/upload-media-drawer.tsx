"use client";

import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import {
  Drawer,
  DrawerHeader,
  DrawerItems,
  Label,
  TextInput,
} from "flowbite-react";
import { FileUpIcon, PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import SupabaseFileUploadDropzone from "@/components/supabase-file-upload-dropzone";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { AddJobMedia } from "./actions";
import { useUserContext } from "@/contexts/user";

function AddMediaDrawerFormFields() {
  const { businessId, locationId, jobId } = useParams();
  const { pending } = useFormStatus();
  const { user } = useUserContext();

  return (
    <fieldset disabled={pending} className="grid gap-2 lg:gap-6">
      <input name="job_id" value={jobId} type="hidden" />
      <input name="location_id" value={locationId} type="hidden" />
      <input name="business_id" value={businessId} type="hidden" />
      <input name="profile_id" value={user.id} type="hidden" />
      <div>
        <Label htmlFor="name" className="mb-2 block">
          Name
        </Label>
        <TextInput autoComplete="off" id="name" name="name" required />
      </div>
      <SupabaseFileUploadDropzone
        bucket="business"
        filePath={`${businessId}/locations/${locationId}/jobs/${jobId}`}
        name="path"
        required
      />

      <SubmitButton pendingText="Uploading media...">
        <FileUpIcon className="mr-2" />
        Upload media
      </SubmitButton>
    </fieldset>
  );
}

export default function UploadMediaDrawer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [state, action] = useActionState(
    AddJobMedia<TInitialFormState>,
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
        className="shrink-0 cursor-pointer rounded-full p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => setIsOpen(true)}
      >
        <PlusIcon className="fill-gray-200" />
      </div>
      {isOpen && (
        <Drawer open={isOpen} onClose={() => setIsOpen(false)} position="right">
          <DrawerHeader
            title="Upload media"
            titleIcon={() => <FileUpIcon className="mr-2" />}
          />
          <DrawerItems>
            {state.error && (
              <div className="my-4">
                <ErrorAlert message={state.error} />
              </div>
            )}
            <form action={action} className="my-4">
              <AddMediaDrawerFormFields />
            </form>
          </DrawerItems>
        </Drawer>
      )}
    </>
  );
}
