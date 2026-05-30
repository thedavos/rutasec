import { createFileRoute } from "@tanstack/react-router";

import { SignInPage } from "#/modules/identity/presentation/sign-in-page";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [{ title: "Sign in — RutaSec" }],
  }),
  component: SignInPage,
});
