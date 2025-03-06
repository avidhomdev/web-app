import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <main className="mx-auto flex flex-col items-center justify-center px-6 pt-8 md:h-screen">
      {children}
    </main>
  );
}
