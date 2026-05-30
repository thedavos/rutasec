import type { EnsureAppUser } from "#/modules/identity/application/ensure-app-user/ensure-app-user";
import type {
  ResolveAuthenticatedAppUser,
  ResolveAuthenticatedAppUserInput,
} from "#/modules/identity/application/resolve-authenticated-app-user/resolve-authenticated-app-user";
import type { AppUser } from "#/modules/identity/domain/entities/app-user";
import {
  unauthorizedError,
  type IdentityError,
} from "#/modules/identity/domain/errors/identity-errors";
import type { SessionPort } from "#/modules/identity/domain/ports/session-port";
import { err, type Result } from "#/shared/domain/result";

export class ResolveAuthenticatedAppUserUseCase implements ResolveAuthenticatedAppUser {
  constructor(
    private readonly sessions: SessionPort,
    private readonly ensureAppUser: EnsureAppUser,
  ) {}

  async execute(input: ResolveAuthenticatedAppUserInput): Promise<Result<AppUser, IdentityError>> {
    const snapshot = await this.sessions.getAuthUserSnapshot(input.headers);
    if (!snapshot) {
      return err(unauthorizedError());
    }

    return this.ensureAppUser.execute(snapshot);
  }
}
