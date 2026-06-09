export const guestLibraryQueryKeys = {
  all: ["guest-library"] as const,
  entries: () => [...guestLibraryQueryKeys.all, "entries"] as const,
  isSaved: (resourceId: string) => [...guestLibraryQueryKeys.all, "is-saved", resourceId] as const,
};
