import Form from "next/form";
import SubmitButton from "@/components/submit-button";
import { Card, Checkbox, createTheme, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { signInAction } from "./actions";
import ErrorAlert from "@/components/error-alert";

export function metadata() {
  return {
    title: "Sign In",
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email: string; error: string }>;
}) {
  const { email, error } = await searchParams;

  return (
    <Card
      horizontal
      imgAlt=""
      imgSrc="/images/authentication/login.jpg"
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
      <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl dark:text-white">
        Sign in to HOM
      </h2>
      {error && <ErrorAlert message={error} />}
      <Form action={signInAction} className="mt-8 space-y-6">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="email">Your email</Label>
          <TextInput
            defaultValue={email}
            id="email"
            name="email"
            placeholder="name@company.com"
            type="email"
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="password">Your password</Label>
          <TextInput
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <Checkbox id="rememberMe" name="rememberMe" />
            <Label htmlFor="rememberMe">Remember me</Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-primary-700 dark:text-primary-500 text-right text-sm hover:underline"
          >
            Lost Password?
          </Link>
        </div>
        <div className="mb-6">
          <SubmitButton pendingText="Signing in..." size="lg">
            Sign in to your account
          </SubmitButton>
        </div>
      </Form>
    </Card>
  );
}
