"use client";

import { Button, Spinner } from "flowbite-react";
import { PropsWithChildren } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = PropsWithChildren & {
  pendingText?: string;
  size?: "sm" | "md" | "lg";
};

export default function SubmitButton({
  children,
  pendingText,
  size,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" color="primary" size={size}>
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
