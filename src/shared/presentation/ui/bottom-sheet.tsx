import * as React from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "#/shared/presentation/ui/sheet";
import { cn } from "#/shared/utils";

function BottomSheet({ ...props }: React.ComponentProps<typeof Sheet>) {
  return <Sheet data-slot="bottom-sheet" {...props} />;
}

function BottomSheetTrigger({ ...props }: React.ComponentProps<typeof SheetTrigger>) {
  return <SheetTrigger data-slot="bottom-sheet-trigger" {...props} />;
}

function BottomSheetClose({ ...props }: React.ComponentProps<typeof SheetClose>) {
  return <SheetClose data-slot="bottom-sheet-close" {...props} />;
}

function BottomSheetContent({
  className,
  children,
  showCloseButton = true,
  showDragHandle = true,
  ...props
}: React.ComponentProps<typeof SheetContent> & {
  showCloseButton?: boolean;
  showDragHandle?: boolean;
}) {
  return (
    <SheetContent
      side="bottom"
      showCloseButton={showCloseButton}
      className={cn(
        "max-h-[85dvh] gap-3 overflow-y-auto rounded-t-2xl border-[var(--border-default)] bg-[var(--surface)] pb-[env(safe-area-inset-bottom)]",
        className,
      )}
      {...props}
    >
      {showDragHandle ? (
        <div
          className="mx-auto mt-3 mb-1 h-1 w-9 shrink-0 rounded-full bg-[var(--border-default)]"
          aria-hidden
        />
      ) : null}
      {children}
    </SheetContent>
  );
}

function BottomSheetHeader({ className, ...props }: React.ComponentProps<typeof SheetHeader>) {
  return (
    <SheetHeader
      data-slot="bottom-sheet-header"
      className={cn("px-4 pt-2 pb-0 text-left", className)}
      {...props}
    />
  );
}

function BottomSheetFooter({ className, ...props }: React.ComponentProps<typeof SheetFooter>) {
  return (
    <SheetFooter
      data-slot="bottom-sheet-footer"
      className={cn("px-4 pb-4", className)}
      {...props}
    />
  );
}

function BottomSheetTitle({ className, ...props }: React.ComponentProps<typeof SheetTitle>) {
  return (
    <SheetTitle
      data-slot="bottom-sheet-title"
      className={cn("display-title text-[var(--text-primary)]", className)}
      {...props}
    />
  );
}

function BottomSheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetDescription>) {
  return (
    <SheetDescription
      data-slot="bottom-sheet-description"
      className={cn("text-[var(--text-secondary)]", className)}
      {...props}
    />
  );
}

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetFooter,
  BottomSheetTitle,
  BottomSheetDescription,
};
