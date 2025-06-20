// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6f5f4bc2e85657bea40a7167e3890428@o4509531212742656.ingest.us.sentry.io/4509531213529088",
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.01,
  replaysSessionSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
