import { Link } from "@tanstack/react-router";

import { authClient } from "#/modules/identity";
import { Avatar, AvatarFallback, AvatarImage } from "#/shared/presentation/ui/avatar";
import { Button } from "#/shared/presentation/ui/button";
import { Skeleton } from "#/shared/presentation/ui/skeleton";
import { cn } from "#/shared/utils";

export type AuthHeaderLayout = "inline" | "stacked";

type AuthHeaderActionsProps = {
  layout?: AuthHeaderLayout;
};

export function AuthHeaderActions({ layout = "inline" }: AuthHeaderActionsProps) {
  const { data: session, isPending } = authClient.useSession();
  const isStacked = layout === "stacked";

  if (isPending) {
    return <Skeleton className={cn("rounded-md", isStacked ? "h-10 w-full" : "h-9 w-24")} />;
  }

  if (session?.user) {
    const initial = session.user.name?.charAt(0).toUpperCase() || "U";

    return (
      <div className={cn(isStacked ? "flex w-full flex-col gap-3" : "flex items-center gap-2")}>
        <div className={cn("flex items-center gap-2", isStacked && "px-1")}>
          <Avatar size="sm">
            {session.user.image ? <AvatarImage src={session.user.image} alt="" /> : null}
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          {isStacked && session.user.name ? (
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {session.user.name}
            </span>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(isStacked && "h-10 w-full")}
          onClick={() => {
            void authClient.signOut();
          }}
        >
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className={cn(isStacked ? "flex w-full flex-col gap-2" : "flex items-center gap-2")}>
      <Button
        variant={isStacked ? "outline" : "ghost"}
        size="sm"
        className={cn(isStacked && "h-10 w-full")}
        asChild
      >
        <Link to="/sign-in">Sign in</Link>
      </Button>
      <Button size="sm" className={cn(isStacked && "h-10 w-full")} asChild>
        <Link to="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

export function AuthHeader() {
  return (
    <div className="hidden md:flex">
      <AuthHeaderActions layout="inline" />
    </div>
  );
}
