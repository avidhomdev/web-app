import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6f5f4bc2e85657bea40a7167e3890428@o4509531212742656.ingest.us.sentry.io/4509531213529088",
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.01,
  debug: false,
});
