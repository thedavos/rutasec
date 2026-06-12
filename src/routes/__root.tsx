import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import { QueryProvider } from "#/integrations/query-provider";
import { AuthHeader } from "#/modules/identity/presentation/auth-header";
import { GuestLibrarySyncProvider } from "#/modules/library/presentation/guest-library/guest-library-sync-provider";
import * as m from "#/paraglide/messages.js";
import { getLocale } from "#/paraglide/runtime.js";
import { AuthenticatedNavGroup } from "#/shared/presentation/layout/authenticated-nav-group";
import { MobileNavDrawer } from "#/shared/presentation/layout/mobile-nav-drawer";
import { PublicNavGroup } from "#/shared/presentation/layout/public-nav-group";
import { SiteFooter } from "#/shared/presentation/layout/site-footer";
import { buildPageHead } from "#/shared/presentation/seo/build-page-head";
import { Button } from "#/shared/presentation/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/presentation/ui/card";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  component: AppLayout,
  notFoundComponent: NotFoundPage,
  head: () => {
    const pageHead = buildPageHead({
      title: m.meta_catalog_title(),
      description: m.meta_site_description(),
      path: "/",
    });

    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        ...pageHead.meta,
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "icon",
          href: "/favicon.ico",
          sizes: "any",
        },
        {
          rel: "apple-touch-icon",
          href: "/rutasec.png",
        },
        {
          rel: "manifest",
          href: "/manifest.json",
        },
      ],
    };
  },
  shellComponent: RootDocument,
});

function NotFoundPage() {
  return (
    <Card className="island-shell mx-auto max-w-lg rounded-2xl border-[var(--border-default)] py-8 text-center shadow-none">
      <CardHeader>
        <CardTitle className="display-title text-2xl">{m.not_found_title()}</CardTitle>
        <CardDescription>{m.not_found_description()}</CardDescription>
        <Button asChild className="mt-4">
          <Link to="/">{m.back_to_resources()}</Link>
        </Button>
      </CardHeader>
    </Card>
  );
}

function AppLayout() {
  return (
    <QueryProvider>
      <GuestLibrarySyncProvider>
        <div className="flex min-h-screen flex-col">
          <header className="bg-transparent">
            <div className="page-wrap flex items-center justify-between gap-3 py-3">
              <Link to="/" className="flex min-w-0 items-center gap-2 no-underline">
                <span className="brand-mark" aria-hidden="true">
                  <img src="/rutasec-brand-mark.svg" alt="" className="block size-9" />
                </span>
                <span className="display-title block text-lg leading-none font-bold text-[var(--text-primary)]">
                  {m.brand_name()}
                </span>
              </Link>
              <nav className="hidden items-center gap-1 md:flex" aria-label={m.nav_main_aria()}>
                <AuthenticatedNavGroup />
                <PublicNavGroup />
              </nav>
              <div className="flex shrink-0 items-center gap-2">
                <AuthHeader />
                <MobileNavDrawer />
              </div>
            </div>
          </header>

          <main className="page-wrap flex flex-1 flex-col py-8 sm:py-10">
            <Outlet />
          </main>

          <SiteFooter />
        </div>
      </GuestLibrarySyncProvider>
    </QueryProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
