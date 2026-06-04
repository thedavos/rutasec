import type { ReactNode } from "react";

import { Button } from "#/shared/presentation/ui/button";

export type MainNavExternalLinkProps = {
  href: string;
  label: string;
  icon?: ReactNode;
};

export function MainNavExternalLink({ href, label, icon }: MainNavExternalLinkProps) {
  return (
    <Button variant="ghost" size="sm" asChild className="font-semibold">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="nav-link inline-flex items-center gap-1.5"
      >
        {icon}
        {label}
      </a>
    </Button>
  );
}
