import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import { Alert, Card, Label, TextInput } from "flowbite-react";
import Form from "next/form";
import { ResetPassword } from "./action";

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
      className="flex w-full md:max-w-screen-lg"
      theme={{
        root: {
          children: "my-auto w-full gap-0 space-y-8 p-6 sm:p-8 lg:p-16",
        },
        img: {
          horizontal: {
            on: "hidden w-2/3 rounded-l-lg md:w-96 md:p-0 lg:block",
          },
        },
      }}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
        Reset your password
      </h2>
      {success && <Alert color="success">Successfully updated password!</Alert>}
      {error && <ErrorAlert message={error} />}
      <Form action={ResetPassword} className="mt-8 space-y-6">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="newPassword">New password</Label>
          <TextInput
            id="newPassword"
            name="newPassword"
            placeholder="••••••••"
            required
            type="password"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
          <TextInput
            id="confirmNewPassword"
            name="confirmNewPassword"
            placeholder="••••••••"
            required
            type="password"
          />
        </div>
        <div>
          <SubmitButton pendingText="Resetting..." size="lg">
            Reset password
          </SubmitButton>
        </div>
      </Form>
    </Card>
  );
}
