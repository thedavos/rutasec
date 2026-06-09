import { useRouter } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { authClient } from "#/modules/identity";
import { syncGuestLibraryToServer } from "#/modules/library/presentation/guest-library/guest-library-client";
import { guestLibraryQueryKeys } from "#/modules/library/presentation/guest-library/guest-library-query-keys";
import { useQueryClient } from "@tanstack/react-query";

type GuestLibrarySyncProviderProps = {
  children: React.ReactNode;
};

export function GuestLibrarySyncProvider({ children }: GuestLibrarySyncProviderProps) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const syncedForUserRef = useRef<string | null>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const userId = session?.user?.id ?? null;

    if (!userId || syncedForUserRef.current === userId || isSyncingRef.current) {
      return;
    }

    syncedForUserRef.current = userId;
    isSyncingRef.current = true;

    void syncGuestLibraryToServer()
      .then(async () => {
        await queryClient.invalidateQueries({ queryKey: guestLibraryQueryKeys.all });
        await router.invalidate();
      })
      .finally(() => {
        isSyncingRef.current = false;
      });
  }, [session?.user?.id, queryClient, router]);

  return children;
}
