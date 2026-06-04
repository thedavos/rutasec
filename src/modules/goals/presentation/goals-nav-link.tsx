import { Target } from "lucide-react";

import { MainNavLink } from "#/shared/presentation/layout/main-nav-link";

export function GoalsNavLink() {
  return <MainNavLink to="/goals" label="Goals" icon={<Target className="size-4" aria-hidden />} />;
}
