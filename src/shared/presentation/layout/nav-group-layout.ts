export type NavGroupLayout = "inline" | "stacked";

export function navGroupContainerClass(layout: NavGroupLayout = "inline") {
  return layout === "stacked"
    ? "flex flex-col items-stretch gap-1"
    : "flex items-center gap-2 rounded-md border-transparent bg-none p-1";
}
