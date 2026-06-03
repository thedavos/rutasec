import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  type AnyRouter,
} from "@tanstack/react-router";
import { render, type RenderResult } from "@testing-library/react";
import type { ComponentType } from "react";
import { expect } from "vite-plus/test";

function createNavTestRouteTree(NavLink: ComponentType) {
  const rootRoute = createRootRoute({
    component: () => <NavLink />,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
  });

  const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
  });

  const libraryRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/library",
  });

  const goalsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/goals",
  });

  const goalTimelineRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/goals/$goalId/timeline",
  });

  const resourceRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/resources/$id",
  });

  return rootRoute.addChildren([
    indexRoute,
    dashboardRoute,
    libraryRoute,
    goalsRoute,
    goalTimelineRoute,
    resourceRoute,
  ]);
}

export function createNavTestRouter(pathname: string, NavLink: ComponentType): AnyRouter {
  return createRouter({
    routeTree: createNavTestRouteTree(NavLink),
    history: createMemoryHistory({ initialEntries: [pathname] }),
    defaultPendingMinMs: 0,
  });
}

export async function renderNavLink(
  pathname: string,
  NavLink: ComponentType,
): Promise<RenderResult & { router: AnyRouter }> {
  const router = createNavTestRouter(pathname, NavLink);
  await router.load();

  const view = render(<RouterProvider router={router} />);

  return { router, ...view };
}

export function expectNavLinkActive(link: HTMLElement) {
  expect(link.className).toContain("is-active");
  expect(link.getAttribute("aria-current")).toBe("page");
}

export function expectNavLinkInactive(link: HTMLElement) {
  expect(link.className).not.toContain("is-active");
  expect(link.getAttribute("aria-current")).toBeNull();
}
