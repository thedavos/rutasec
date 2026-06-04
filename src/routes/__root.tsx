import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ShieldCheck } from "lucide-react";

import { AuthHeader } from "#/modules/identity/presentation/auth-header";
import { AuthenticatedNavGroup } from "#/shared/presentation/layout/authenticated-nav-group";
import { PublicNavGroup } from "#/shared/presentation/layout/public-nav-group";
import {
  footerSignInPrompt,
  footerTransparencyCopy,
} from "#/modules/catalog/presentation/copy/transparency-copy";
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
    <Card className="island-shell mx-auto max-w-lg rounded-2xl border-[var(--border-default)] py-8 text-center shadow-none">
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
          <header className="sticky top-0 z-20 border-b border-[var(--border-default)] bg-[var(--header-bg)] backdrop-blur-md">
            <div className="page-wrap flex items-center justify-between gap-4 py-3">
              <Link to="/" className="flex items-center gap-3 no-underline">
                <span className="brand-mark" aria-hidden="true">
                  <ShieldCheck className="size-4" />
                </span>
                <span>
                  <span className="display-title block text-lg font-bold text-[var(--text-primary)]">
                    RutaSec
                  </span>
                  <span className="hidden text-xs font-medium text-[var(--text-secondary)] sm:block">
                    Cyber Learning OS
                  </span>
                </span>
              </Link>
              <nav aria-label="Main" className="flex max-w-[48vw] items-center gap-1 sm:max-w-none">
                <AuthenticatedNavGroup />
                <PublicNavGroup />
              </nav>
              <AuthHeader />
            </div>
          </header>

          <main className="page-wrap flex flex-1 flex-col py-8 sm:py-10">{children}</main>

          <footer className="site-footer py-6">
            <div className="page-wrap space-y-1 text-sm text-[var(--text-secondary)]">
              <p>{footerTransparencyCopy}</p>
              <p>{footerSignInPrompt}</p>
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
