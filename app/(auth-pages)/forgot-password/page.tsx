import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import { Alert, Card, createTheme, Label, TextInput } from "flowbite-react";
import Form from "next/form";
import Link from "next/link";
import { RequestPasswordReset } from "./action";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string; success: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <Card
      horizontal
      imgAlt=""
      imgSrc="/images/authentication/reset-password.jpg"
      className="flex w-full md:max-w-(--breakpoint-lg)"
      theme={createTheme({
        root: {
          children: "my-auto w-full gap-0 space-y-8 p-6 sm:p-8 lg:p-16",
        },
        img: {
          horizontal: {
            on: "hidden w-2/3 rounded-l-lg md:w-96 md:p-0 lg:block",
          },
        },
      })}
    >
      <h2 className="mb-3 text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
        Forgot your password?
      </h2>
      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
        Don&apos;t fret! Just type in your email and we will send you a code to
        reset your password!
      </p>
      {success && <Alert color="success">Password reset email sent!</Alert>}
      {error && <ErrorAlert message={error} />}
      <Form action={RequestPasswordReset} className="mt-8 space-y-6">
        <div className="mb-6 flex flex-col gap-y-2">
          <Label htmlFor="email">Your email</Label>
          <TextInput
            id="email"
            name="email"
            placeholder="name@company.com"
            required
            type="email"
          />
        </div>
        <div className="mb-6 flex justify-end">
          <Link
            href="/sign-in"
            className="text-primary-700 dark:text-primary-500 text-right text-sm hover:underline"
          >
            Remember it?
          </Link>
        </div>
        <div>
          <SubmitButton pendingText="Requesting..." size="lg">
            Request password reset
          </SubmitButton>
        </div>
      </Form>
    </Card>
  );
}
