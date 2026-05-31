import { createFileRoute } from "@tanstack/react-router";
import { getAuth } from "#/modules/identity/adapters/better-auth/server-auth";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => getAuth().handler(request),
      POST: ({ request }) => getAuth().handler(request),
    },
  },
});
