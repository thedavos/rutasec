import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import { authClient } from "#/modules/identity";

export default function BetterAuthHeader() {
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

  return null;
}
