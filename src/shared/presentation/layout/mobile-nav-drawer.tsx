import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { AuthHeaderActions } from "#/modules/identity/presentation/auth-header";
import * as m from "#/paraglide/messages.js";
import { AuthenticatedNavGroup } from "#/shared/presentation/layout/authenticated-nav-group";
import { PublicNavGroup } from "#/shared/presentation/layout/public-nav-group";
import { Button } from "#/shared/presentation/ui/button";
import { Separator } from "#/shared/presentation/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "#/shared/presentation/ui/sheet";

export function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label={m.mobile_nav_open_menu()}
        >
          <Menu className="size-5" aria-hidden />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="border-[var(--border-default)] bg-[var(--surface)]">
        <SheetHeader className="text-left">
          <SheetTitle className="display-title text-[var(--text-primary)]">
            {m.mobile_nav_menu_title()}
          </SheetTitle>
          <SheetDescription className="text-[var(--text-secondary)]">
            {m.mobile_nav_menu_description()}
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4" aria-label={m.nav_main_aria()}>
          <AuthenticatedNavGroup layout="stacked" />
          <PublicNavGroup layout="stacked" />
        </nav>

        <Separator className="bg-[var(--border-default)]" />

        <div className="px-4 pb-4">
          <AuthHeaderActions layout="stacked" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
