export { authClient } from "#/modules/identity/adapters/better-auth/client-auth";
export type {
  AppUser,
  AuthUserSnapshot,
  AppUserRole,
} from "#/modules/identity/domain/entities/app-user";
export type { IdentityError } from "#/modules/identity/domain/errors/identity-errors";
export { identityErrorMessage } from "#/modules/identity/domain/errors/identity-errors";
export { getSessionFn } from "#/modules/identity/server/get-session";
export {
  requireAuthenticatedAppUser,
  resolveAuthenticatedAppUserFn,
} from "#/modules/identity/server/resolve-authenticated-app-user";
