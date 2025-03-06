import { PropsWithChildren } from "react";
import { SettingsHeader } from "./settings-header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <SettingsHeader />
      {children}
    </>
  );
}
