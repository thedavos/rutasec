import { createFileRoute } from "@tanstack/react-router";

import { SendResourcePlaceholderPage } from "#/modules/catalog/presentation/send-resource-placeholder-page";

export const Route = createFileRoute("/send-resource")({
  head: () => ({
    meta: [{ title: "Send Resource — RutaSec" }],
  }),
  component: SendResourceRoute,
});

function SendResourceRoute() {
  return <SendResourcePlaceholderPage />;
}
