import { createFileRoute } from "@tanstack/react-router";

import { SignUpPage } from "#/modules/identity/presentation/sign-up-page";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [{ title: "Create account — RutaSec" }],
  }),
  component: SignUpPage,
});
