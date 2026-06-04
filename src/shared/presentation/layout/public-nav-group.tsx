import { Github } from "lucide-react";

import { MainNavExternalLink } from "#/shared/presentation/layout/main-nav-external-link";
import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";
import { RUTASEC_GITHUB_URL } from "#/shared/presentation/layout/public-nav.constants";

export function PublicNavGroup() {
  return (
    <div className="flex items-center gap-1 overflow-x-auto rounded-md border border-[var(--border-default)] bg-[var(--surface)] p-1">
      <MainNavExternalLink
        href={RUTASEC_GITHUB_URL}
        label="GitHub"
        icon={<Github className="size-4" aria-hidden />}
      />
      <MainNavLink to="/send-resource" label="Send Resource" />
    </div>
  );
}
