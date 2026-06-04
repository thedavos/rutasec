import { Github } from "lucide-react";

import { MainNavExternalLink } from "#/shared/presentation/layout/main-nav-external-link";
import { RUTASEC_GITHUB_URL } from "#/shared/presentation/layout/public-nav.constants";

type GithubNavLinkProps = {
  stacked?: boolean;
};

export function GithubNavLink({ stacked = false }: GithubNavLinkProps) {
  return (
    <MainNavExternalLink
      href={RUTASEC_GITHUB_URL}
      label="GitHub"
      icon={<Github className="size-4" aria-hidden />}
      stacked={stacked}
    />
  );
}
