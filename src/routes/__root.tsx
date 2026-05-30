import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import { AuthHeader } from "#/modules/identity/presentation/auth-header";
import { Button } from "#/shared/presentation/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/presentation/ui/card";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
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
    <Card className="island-shell mx-auto max-w-lg rounded-2xl border-[var(--line)] py-8 text-center shadow-none">
      <CardHeader>
        <CardTitle className="display-title text-2xl">Page not found</CardTitle>
        <CardDescription>The resource or page you requested does not exist.</CardDescription>
        <Button asChild className="mt-4">
          <Link to="/">Back to catalog</Link>
        </Button>
      </CardHeader>
    </Card>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-md">
            <div className="page-wrap flex items-center justify-between gap-4 py-4">
              <Link to="/" className="no-underline">
                <span className="display-title text-xl font-bold text-[var(--sea-ink)]">
                  RutaSec
                </span>
                <span className="ml-2 hidden text-sm text-[var(--sea-ink-soft)] sm:inline">
                  Learning catalog
                </span>
              </Link>
              <nav aria-label="Main">
                <Button variant="ghost" size="sm" asChild className="font-semibold">
                  <Link to="/" className="nav-link is-active">
                    Catalog
                  </Link>
                </Button>
              </nav>
              <AuthHeader />
            </div>
          </header>

          <main className="page-wrap flex flex-1 flex-col py-10">{children}</main>

          <footer className="site-footer py-6">
            <div className="page-wrap text-sm text-[var(--sea-ink-soft)]">
              Curated cybersecurity resources with source attribution. Personal library and progress
              coming soon.
            </div>
          </footer>
        </div>
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
