import { Send } from "lucide-react";

import * as m from "#/paraglide/messages.js";
import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";

type SendResourceNavLinkProps = {
  stacked?: boolean;
};

export function SendResourceNavLink({ stacked = false }: SendResourceNavLinkProps) {
  return (
    <MainNavLink
      to="/send-resource"
      label={m.nav_send_resource()}
      icon={<Send className="size-4" aria-hidden />}
      stacked={stacked}
    />
  );
}
