import { createFileRoute } from "@tanstack/react-router";

import { SendResourcePage } from "#/modules/catalog/presentation/send-resource-page";

export const Route = createFileRoute("/send-resource")({
  head: () => ({
    meta: [{ title: "Send Resource — RutaSec" }],
  }),
  component: SendResourceRoute,
});

function SendResourceRoute() {
  return <SendResourcePage />;
}
