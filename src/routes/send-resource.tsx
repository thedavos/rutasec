import { createFileRoute } from "@tanstack/react-router";

import { getCatalogFilterOptionsFn } from "#/modules/catalog";
import { SendResourcePage } from "#/modules/catalog/presentation/send-resource-page";
import * as m from "#/paraglide/messages.js";
import { buildPageHead } from "#/shared/presentation/seo/build-page-head";
import { Skeleton } from "#/shared/presentation/ui/skeleton";

export const Route = createFileRoute("/send-resource")({
  loader: async () => getCatalogFilterOptionsFn(),
  head: () =>
    buildPageHead({
      title: m.meta_send_resource_title(),
      description: m.send_resource_description(),
      path: "/send-resource",
    }),
  pendingComponent: SendResourcePending,
  component: SendResourceRoute,
});

function SendResourceRoute() {
  const filterOptions = Route.useLoaderData();

  return <SendResourcePage categories={filterOptions.categories} />;
}

function SendResourcePending() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
      <header className="max-w-3xl">
        <Skeleton className="mb-3 h-4 w-28 rounded-md" />
        <Skeleton className="h-10 w-full max-w-xl rounded-md" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <section aria-label={m.loading_proposal_form_aria()} className="flex flex-col gap-4">
          <div>
            <Skeleton className="h-7 w-44 rounded-md" />
            <Skeleton className="mt-3 h-4 w-72 rounded-md" />
          </div>
          <div className="island-shell rounded-2xl border border-[var(--border-default)] p-6">
            <div className="grid gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              ))}
              <div className="space-y-2">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            </div>
          </div>
        </section>

        <section aria-label={m.loading_proposal_preview_aria()} className="flex flex-col gap-4">
          <div>
            <Skeleton className="h-7 w-40 rounded-md" />
            <Skeleton className="mt-3 h-4 w-80 rounded-md" />
          </div>
          <div className="island-shell rounded-2xl border border-[var(--border-default)] p-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-52 rounded-md" />
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-full rounded-md" />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
