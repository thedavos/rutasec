import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  listGuestLibraryEntries,
  removeGuestLibraryEntry,
  retryFailedGuestLibrarySync,
  saveGuestLibraryEntry,
  syncGuestLibraryToServer,
} from "#/modules/library/presentation/guest-library/guest-library-client";
import { guestLibraryQueryKeys } from "#/modules/library/presentation/guest-library/guest-library-query-keys";

export function useGuestLibraryEntries() {
  return useQuery({
    queryKey: guestLibraryQueryKeys.entries(),
    queryFn: listGuestLibraryEntries,
    enabled: typeof indexedDB !== "undefined",
  });
}

export function useIsGuestResourceSaved(resourceId: string) {
  const query = useGuestLibraryEntries();
  const isSaved =
    query.data?.some(
      (entry) =>
        entry.resourceId === resourceId &&
        (entry.syncStatus === "pending" || entry.syncStatus === "failed"),
    ) ?? false;

  return {
    isSaved,
    isPending: query.isPending,
  };
}

export function useGuestLibrarySave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...guestLibraryQueryKeys.all, "save"],
    mutationFn: saveGuestLibraryEntry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: guestLibraryQueryKeys.all });
    },
  });
}

export function useGuestLibraryRemove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...guestLibraryQueryKeys.all, "remove"],
    mutationFn: removeGuestLibraryEntry,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: guestLibraryQueryKeys.all });
    },
  });
}

export function useGuestLibrarySyncMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...guestLibraryQueryKeys.all, "sync"],
    mutationFn: syncGuestLibraryToServer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: guestLibraryQueryKeys.all });
    },
  });
}

export function useRetryGuestLibrarySync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...guestLibraryQueryKeys.all, "retry-sync"],
    mutationFn: retryFailedGuestLibrarySync,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: guestLibraryQueryKeys.all });
    },
  });
}
