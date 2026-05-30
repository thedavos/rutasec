import type { AppUser } from "#/modules/identity/domain/entities/app-user";
import type { IdentityError } from "#/modules/identity/domain/errors/identity-errors";
import type { Result } from "#/shared/domain/result";

export type ResolveAuthenticatedAppUserInput = {
  headers: Headers;
};

export interface ResolveAuthenticatedAppUser {
  execute(input: ResolveAuthenticatedAppUserInput): Promise<Result<AppUser, IdentityError>>;
}
