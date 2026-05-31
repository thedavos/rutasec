import { createBetterAuthSessionAdapter } from "#/modules/identity/adapters/better-auth/better-auth-session-adapter";
import { createD1AppUserAdapter } from "#/modules/identity/adapters/d1/d1-app-user-adapter";
import {
  EnsureAppUserUseCase,
  ResolveAuthenticatedAppUserUseCase,
} from "#/modules/identity/application";
import { getDb } from "#/shared/db";

export type IdentityModule = {
  ensureAppUser: EnsureAppUserUseCase;
  resolveAuthenticatedAppUser: ResolveAuthenticatedAppUserUseCase;
};

export function createIdentityModule(db: D1Database): IdentityModule {
  const appUsers = createD1AppUserAdapter(db);
  const sessions = createBetterAuthSessionAdapter();
  const ensureAppUser = new EnsureAppUserUseCase(appUsers);

  return {
    ensureAppUser,
    resolveAuthenticatedAppUser: new ResolveAuthenticatedAppUserUseCase(sessions, ensureAppUser),
  };
}

export function getIdentityModule(): IdentityModule {
  return createIdentityModule(getDb());
}
