import type { ReactNode } from "react";

import { Button } from "#/shared/presentation/ui/button";
import { cn } from "#/shared/utils";

export type MainNavExternalLinkProps = {
  href: string;
  label: string;
  icon?: ReactNode;
  stacked?: boolean;
};

export function MainNavExternalLink({
  href,
  label,
  icon,
  stacked = false,
}: MainNavExternalLinkProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className={cn("font-semibold", stacked && "h-10 w-full justify-start")}
    >
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
