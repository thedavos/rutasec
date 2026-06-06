import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSessionFn } from "#/modules/identity/server/get-session";
import {
  getPersonalLibraryFn,
  USER_RESOURCE_STATUSES,
  type GetPersonalLibraryInput,
  type UserResourceStatus,
} from "#/modules/library";
import { PersonalLibraryPage } from "#/modules/library/presentation/personal-library-page";
import * as m from "#/paraglide/messages.js";

function parseLibrarySearch(search: Record<string, unknown>): GetPersonalLibraryInput {
  if (typeof search.status !== "string" || !search.status.trim()) {
    return {};
  }

  const normalized = search.status.trim().toLowerCase() as UserResourceStatus;
  if (USER_RESOURCE_STATUSES.includes(normalized)) {
    return { status: normalized };
  }

  return {};
}

export const Route = createFileRoute("/library/")({
  validateSearch: parseLibrarySearch,
  loaderDeps: ({ search }) => search,
  beforeLoad: async ({ location }) => {
    const session = await getSessionFn();
    if (!session?.user) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.pathname },
      });
    }
  },
  loader: async ({ deps }) => getPersonalLibraryFn({ data: deps }),
  head: () => ({
    meta: [{ title: m.meta_library_title() }],
  }),
  component: LibraryRoute,
});

function LibraryRoute() {
  const library = Route.useLoaderData();
  return <PersonalLibraryPage library={library} />;
}
