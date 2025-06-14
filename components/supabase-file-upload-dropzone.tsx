"use client";

import { createClient } from "@/utils/supabase/client";
import { FileInput, Label, TextInput } from "flowbite-react";
import { Trash2Icon } from "lucide-react";
import { ChangeEvent, Fragment, useCallback, useState } from "react";
import ErrorAlert from "./error-alert";

type TSupabaseFileUploadDropzone = {
  bucket: string;
  defaultPath?: string;
  filePath: string;
  allowedFilesText?: string;
  name: string;
  required?: boolean;
};

export default function SupabaseFileUploadDropzone({
  bucket,
  filePath,
  allowedFilesText = "SVG, PNG, JPG or GIF (MAX. 800x400px)",
  name = "file_url",
  required = false,
  defaultPath = "",
}: TSupabaseFileUploadDropzone) {
  const [path, setPath] = useState<string>(defaultPath);
  const [error, setError] = useState<string>();

  const reset = useCallback(() => {
    setError("");
    setPath("");
  }, []);

  const handleUploadToSupabase = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      reset();
      const supabase = createClient();
      const files = e.currentTarget.files ?? [];
      const file = files[0];

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(`${filePath}/${new Date().toISOString()}-${file.name}`, file, {
          upsert: true,
        });

      if (error) return setError(error.message);
      if (!data?.path) return setError("No path found.");
      return setPath(data.path);
    },
    [bucket, filePath, reset],
  );

  return (
    <Fragment key={path}>
      <input type="hidden" name={name} value={path ?? ""} />
      {error && <ErrorAlert message={error} />}
      {path ? (
        <>
          <Label>Path</Label>
          <div className="flex items-center gap-2">
            <TextInput readOnly value={path} className="grow" />
            <button
              className="rounded-lg border border-gray-300 p-3 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-700"
              onClick={reset}
            >
              <Trash2Icon className="size-4 text-red-500" />
            </button>
          </div>
        </>
      ) : (
        <Label
          htmlFor={name}
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {allowedFilesText}
            </p>
          </div>
          <FileInput
            id={name}
            className="hidden"
            onChange={handleUploadToSupabase}
            required={required}
          />
        </Label>
      )}
    </Fragment>
  );
}
