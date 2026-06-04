import { Link } from "@tanstack/react-router";
import { BookMarked, Target } from "lucide-react";

import { Button } from "#/shared/presentation/ui/button";

export function DashboardQuickActions() {
  return (
    <div className="flex flex-col shrink-0 flex-wrap gap-2">
      <Button asChild variant="outline" size="sm">
        <Link to="/library" className="inline-flex items-center gap-1.5">
          <BookMarked className="size-4" aria-hidden />
          Library
        </Link>
      </Button>
      <Button asChild variant="outline" size="sm">
        <Link to="/goals" className="inline-flex items-center gap-1.5">
          <Target className="size-4" aria-hidden />
          Goals
        </Link>
      </Button>
    </div>
  );
}
