import type { CatalogResourceCardAttribution } from "#/modules/catalog/domain/entities/resource";
import { cn } from "#/shared/utils";

type ResourceAttributionProps = {
  attribution: CatalogResourceCardAttribution;
  variant?: "compact" | "full";
  className?: string;
};

const linkClassName = "font-semibold text-[var(--sea-ink)] underline-offset-2 hover:underline";

function AttributionRow({ label, href, name }: { label: string; href: string; name: string }) {
  return (
    <p>
      <span className="font-semibold text-[var(--sea-ink)]">{label}: </span>
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {name}
      </a>
    </p>
  );
}

export function ResourceAttribution({
  attribution,
  variant = "compact",
  className,
}: ResourceAttributionProps) {
  return (
    <div
      className={cn(
        "leading-relaxed text-[var(--sea-ink-soft)]",
        variant === "compact" ? "space-y-1 text-xs" : "space-y-3 text-sm",
        className,
      )}
    >
      <AttributionRow
        label="Original source"
        href={attribution.originalSourceUrl}
        name={attribution.originalSourceName}
      />
      <AttributionRow
        label="Curated from"
        href={attribution.curatedFromUrl}
        name={attribution.curatedFromName}
      />
    </div>
  );
}
