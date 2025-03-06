import SubmitButton from "@/components/submit-button";
import { Card, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";

export default function Page() {
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
      <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
        Forgot your password?
      </h2>
      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
        Don&apos;t fret! Just type in your email and we will send you a code to
        reset your password!
      </p>
      <form className="mt-8 space-y-6">
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
        <div className="mb-6 flex flex-col gap-x-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-x-3">
            <Checkbox id="acceptTerms" name="acceptTerms" required />
            <Label htmlFor="acceptTerms">
              I accept the&nbsp;
              <Link
                href="#"
                className="text-primary-700 hover:underline dark:text-primary-500"
              >
                Terms and Conditions
              </Link>
            </Label>
          </div>
          <Link
            href="/sign-in"
            className="text-right text-sm text-primary-700 hover:underline dark:text-primary-500"
          >
            Remember it?
          </Link>
        </div>
        <div>
          <SubmitButton pendingText="Requesting..." size="lg">
            Request password reset
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
}
