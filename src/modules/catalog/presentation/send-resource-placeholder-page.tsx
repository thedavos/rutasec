import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/presentation/ui/card";

export function SendResourcePlaceholderPage() {
  return (
    <Card className="island-shell mx-auto max-w-lg rounded-2xl border-[var(--border-default)] shadow-none">
      <CardHeader>
        <CardTitle className="display-title text-2xl">Send Resource</CardTitle>
        <CardDescription>
          The resource proposal flow is coming soon. You will be able to prepare a GitHub issue with
          the details we need to review new free learning resources.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
