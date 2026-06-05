import { HeadContent, Link, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import { AuthHeader } from "#/modules/identity/presentation/auth-header";
import { AuthenticatedNavGroup } from "#/shared/presentation/layout/authenticated-nav-group";
import { MobileNavDrawer } from "#/shared/presentation/layout/mobile-nav-drawer";
import { PublicNavGroup } from "#/shared/presentation/layout/public-nav-group";
import { SiteFooter } from "#/shared/presentation/layout/site-footer";
import { Button } from "#/shared/presentation/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/presentation/ui/card";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  component: AppLayout,
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "RutaSec",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function NotFoundPage() {
  return (
    <Card className="island-shell mx-auto max-w-lg rounded-2xl border-[var(--border-default)] py-8 text-center shadow-none">
      <CardHeader>
        <CardTitle className="display-title text-2xl">Page not found</CardTitle>
        <CardDescription>The resource or page you requested does not exist.</CardDescription>
        <Button asChild className="mt-4">
          <Link to="/">Back to resources</Link>
        </Button>
      </CardHeader>
    </Card>
  );
}

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-transparent">
        <div className="page-wrap flex items-center justify-between gap-3 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2 no-underline">
            <span className="brand-mark" aria-hidden="true">
              <img src="/rutasec-brand-mark.svg" alt="" className="block size-9" />
            </span>
            <span className="display-title block text-lg leading-none font-bold text-[var(--text-primary)]">
              RutaSec
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
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
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
