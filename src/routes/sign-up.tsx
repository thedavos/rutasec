import { createFileRoute } from "@tanstack/react-router";

import { SignUpPage } from "#/modules/identity/presentation/sign-up-page";
import * as m from "#/paraglide/messages.js";
import { buildPageHead } from "#/shared/presentation/seo/build-page-head";

export const Route = createFileRoute("/sign-up")({
  head: () =>
    buildPageHead({
      title: m.meta_sign_up_title(),
      description: m.sign_up_description(),
      path: "/sign-up",
    }),
  component: SignUpPage,
});
