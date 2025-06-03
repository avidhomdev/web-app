"use client";

import { Button, Spinner } from "flowbite-react";
import { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = PropsWithChildren & {
  form?: string;
  pendingText?: string;
  size?: "sm" | "md" | "lg";
};

export default function SubmitButton({
  children,
  form,
  pendingText,
  size,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      color="primary"
      disabled={pending}
      form={form}
      size={size}
      type="submit"
    >
      {pending && pendingText ? (
        <>
          <Spinner aria-label="Form submitted" size="sm" className="mr-2" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
