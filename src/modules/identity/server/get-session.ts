import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { getAuth } from "#/modules/identity/adapters/better-auth/server-auth";

export const getSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAuth().api.getSession({
    headers: getRequestHeaders(),
  });

  return session;
});
