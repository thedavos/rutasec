import { useRouterState } from "@tanstack/react-router";
import { Send } from "lucide-react";

import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";

type SendResourceNavLinkProps = {
  stacked?: boolean;
};

export function SendResourceNavLink({ stacked = false }: SendResourceNavLinkProps) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname === "/send-resource") {
    return null;
  }

  return (
    <MainNavLink
      to="/send-resource"
      label="Send Resource"
      icon={<Send className="size-4" aria-hidden />}
      stacked={stacked}
    />
  );
}
