import type { AppUser, AuthUserSnapshot } from "#/modules/identity/domain/entities/app-user";
import type { IdentityError } from "#/modules/identity/domain/errors/identity-errors";
import type { Result } from "#/shared/domain/result";

export interface AppUserPort {
  upsertFromAuthSnapshot(snapshot: AuthUserSnapshot): Promise<Result<AppUser, IdentityError>>;
}
