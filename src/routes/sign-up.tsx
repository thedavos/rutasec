import { createFileRoute } from "@tanstack/react-router";

import { SignUpPage } from "#/modules/identity/presentation/sign-up-page";
import * as m from "#/paraglide/messages.js";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [{ title: m.meta_sign_up_title() }],
  }),
  component: SignUpPage,
});
