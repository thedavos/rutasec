import type { CatalogResourceCardAttribution } from "#/modules/catalog/domain/entities/resource";
import { areAttributionSourcesEqual } from "#/modules/catalog/presentation/components/compare-attribution-sources";
import { cn } from "#/shared/utils";

type ResourceAttributionProps = {
  attribution: CatalogResourceCardAttribution;
  className?: string;
};

const linkClassName = "font-semibold text-[var(--text-primary)] underline-offset-2 hover:underline";

function AttributionRow({ label, href, name }: { label: string; href: string; name: string }) {
  return (
    <p>
      <span className="font-semibold text-[var(--text-primary)]">{label}: </span>
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {name}
      </a>
    </p>
  );
}

export function ResourceAttribution({ attribution, className }: ResourceAttributionProps) {
  const showCuratedFrom = !areAttributionSourcesEqual(
    {
      name: attribution.originalSourceName,
      url: attribution.originalSourceUrl,
    },
    {
      name: attribution.curatedFromName,
      url: attribution.curatedFromUrl,
    },
  );

  return (
    <div
      className={cn("space-y-3 text-sm leading-relaxed text-[var(--text-secondary)]", className)}
    >
      <AttributionRow
        label="Original source"
        href={attribution.originalSourceUrl}
        name={attribution.originalSourceName}
      />
      {showCuratedFrom ? (
        <AttributionRow
          label="Curated from"
          href={attribution.curatedFromUrl}
          name={attribution.curatedFromName}
        />
      ) : null}
    </div>
  );
}
