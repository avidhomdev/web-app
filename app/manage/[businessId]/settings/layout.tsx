import { PropsWithChildren } from "react";
import { SettingsHeader } from "./settings-header";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="container relative flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <SettingsHeader />
      {children}
    </div>
  );
}
