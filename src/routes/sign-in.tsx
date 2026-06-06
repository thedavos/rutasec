import { createFileRoute } from "@tanstack/react-router";

import { SignInPage } from "#/modules/identity/presentation/sign-in-page";
import * as m from "#/paraglide/messages.js";
import { parseSafeRedirectPath } from "#/shared/utils/safe-redirect-path";

export type SignInSearch = {
  redirect?: string;
};

function parseSignInSearch(search: Record<string, unknown>): SignInSearch {
  const redirect = parseSafeRedirectPath(search.redirect);
  return redirect ? { redirect } : {};
}

export const Route = createFileRoute("/sign-in")({
  validateSearch: parseSignInSearch,
  head: () => ({
    meta: [{ title: m.meta_sign_in_title() }],
  }),
  component: SignInRoute,
});

function SignInRoute() {
  const { redirect } = Route.useSearch();
  return <SignInPage redirect={redirect} />;
}
