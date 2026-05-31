export type AppUserRole = "user" | "admin";

export type AppUser = {
  id: string;
  authUserId: string;
  email: string;
  displayName: string | null;
  role: AppUserRole;
  createdAt: string;
  updatedAt: string;
};

export type AuthUserSnapshot = {
  authUserId: string;
  email: string;
  displayName: string | null;
};
