import { ThemeModeScript, ThemeProvider } from "flowbite-react";
import { GeistSans } from "geist/font/sans";
import { twMerge } from "tailwind-merge";
import { customTheme } from "./flowbite-theme";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Avid Turf",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={twMerge(GeistSans.className, "h-full")}
      suppressHydrationWarning
    >
      <head>
        <ThemeModeScript />
      </head>
      <body className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-300">
        <ThemeProvider theme={customTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
