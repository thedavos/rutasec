import { createFileRoute } from "@tanstack/react-router";

import { getSessionFn } from "#/modules/identity/server/get-session";
import {
  getPersonalLibraryFn,
  USER_RESOURCE_STATUSES,
  type GetPersonalLibraryInput,
  type UserResourceStatus,
} from "#/modules/library";
import { GuestLibraryPage } from "#/modules/library/presentation/guest-library-page";
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
  loader: async ({ deps }) => {
    const session = await getSessionFn();
    if (!session?.user) {
      return { mode: "guest" as const };
    }

    const library = await getPersonalLibraryFn({ data: deps });
    return { mode: "authenticated" as const, library };
  },
  head: () => ({
    meta: [{ title: m.meta_library_title() }],
  }),
  component: LibraryRoute,
});

function LibraryRoute() {
  const data = Route.useLoaderData();

  if (data.mode === "guest") {
    return <GuestLibraryPage />;
  }

  return <PersonalLibraryPage library={data.library} />;
}
