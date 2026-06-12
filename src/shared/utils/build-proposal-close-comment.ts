export function buildProposalCloseComment(resourceId?: string): string {
  if (resourceId?.trim()) {
    return [
      "Thanks for submitting this resource proposal.",
      "",
      `It has been reviewed and merged into the RutaSec catalog seed as \`${resourceId.trim()}\`.`,
      "",
      "Closing as completed.",
    ].join("\n");
  }

  return [
    "Thanks for submitting this resource proposal.",
    "",
    "It has been reviewed and merged into the RutaSec catalog seed.",
    "",
    "Closing as completed.",
  ].join("\n");
}
