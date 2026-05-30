import type { AuthUserSnapshot } from "#/modules/identity/domain/entities/app-user";
import type { AppUser } from "#/modules/identity/domain/entities/app-user";
import type { IdentityError } from "#/modules/identity/domain/errors/identity-errors";
import type { Result } from "#/shared/domain/result";

export interface EnsureAppUser {
  execute(snapshot: AuthUserSnapshot): Promise<Result<AppUser, IdentityError>>;
}
