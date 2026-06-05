import { Send } from "lucide-react";

import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";

type SendResourceNavLinkProps = {
  stacked?: boolean;
};

export function SendResourceNavLink({ stacked = false }: SendResourceNavLinkProps) {
  return (
    <MainNavLink
      to="/send-resource"
      label="Send Resource"
      icon={<Send className="size-4" aria-hidden />}
      stacked={stacked}
    />
  );
}
