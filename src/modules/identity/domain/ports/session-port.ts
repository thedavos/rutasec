import type { AuthUserSnapshot } from "#/modules/identity/domain/entities/app-user";

export interface SessionPort {
  getAuthUserSnapshot(headers: Headers): Promise<AuthUserSnapshot | null>;
}
