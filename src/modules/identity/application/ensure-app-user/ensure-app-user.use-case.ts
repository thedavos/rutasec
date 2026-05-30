import type { EnsureAppUser } from "#/modules/identity/application/ensure-app-user/ensure-app-user";
import type { AppUser, AuthUserSnapshot } from "#/modules/identity/domain/entities/app-user";
import type { IdentityError } from "#/modules/identity/domain/errors/identity-errors";
import type { AppUserPort } from "#/modules/identity/domain/ports/app-user-port";
import type { Result } from "#/shared/domain/result";

export class EnsureAppUserUseCase implements EnsureAppUser {
  constructor(private readonly appUsers: AppUserPort) {}

  execute(snapshot: AuthUserSnapshot): Promise<Result<AppUser, IdentityError>> {
    return this.appUsers.upsertFromAuthSnapshot(snapshot);
  }
}
