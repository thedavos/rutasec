import { getAuth } from "#/modules/identity/adapters/better-auth/server-auth";
import type { AuthUserSnapshot } from "#/modules/identity/domain/entities/app-user";
import type { SessionPort } from "#/modules/identity/domain/ports/session-port";

export function createBetterAuthSessionAdapter(): SessionPort {
  return {
    async getAuthUserSnapshot(headers: Headers): Promise<AuthUserSnapshot | null> {
      const session = await getAuth().api.getSession({ headers });
      if (!session?.user) {
        return null;
      }

      return {
        authUserId: session.user.id,
        email: session.user.email,
        displayName: session.user.name ?? null,
      };
    },
  };
}
