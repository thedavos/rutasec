import { Link } from "@tanstack/react-router";

import { authClient } from "#/modules/identity";
import { Avatar, AvatarFallback, AvatarImage } from "#/shared/presentation/ui/avatar";
import { Button } from "#/shared/presentation/ui/button";
import { Skeleton } from "#/shared/presentation/ui/skeleton";

export function AuthHeader() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24 rounded-md" />;
  }

  if (session?.user) {
    const initial = session.user.name?.charAt(0).toUpperCase() || "U";

    return (
      <div className="flex items-center gap-2">
        <Avatar size="sm">
          {session.user.image ? <AvatarImage src={session.user.image} alt="" /> : null}
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        <Button
          type="button"
          variant="outline"
          size="sm"
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
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/sign-in">Sign in</Link>
      </Button>
      <Button size="sm" asChild>
        <Link to="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
