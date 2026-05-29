import type { CatalogResourceCard } from "#/modules/catalog/domain/entities/resource";

type ResourceCardProps = {
  resource: CatalogResourceCard;
};

const levelLabels: Record<CatalogResourceCard["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const typeLabels: Record<CatalogResourceCard["resourceType"], string> = {
  course: "Course",
  book: "Book",
  documentation: "Docs",
  video: "Video",
  lab: "Lab",
  tool: "Tool",
  article: "Article",
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <article className="feature-card island-shell flex h-full flex-col rounded-2xl p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="island-kicker">{resource.category}</span>
        <span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--sea-ink-soft)]">
          {levelLabels[resource.level]}
        </span>
        <span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--sea-ink-soft)]">
          {typeLabels[resource.resourceType]}
        </span>
        {resource.isFree ? (
          <span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--palm)]">
            Free
          </span>
        ) : null}
      </div>

      <h2 className="display-title text-xl font-bold leading-tight text-[var(--sea-ink)]">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline hover:text-[var(--lagoon-deep)]"
        >
          {resource.title}
        </a>
      </h2>

      {resource.description ? (
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
          {resource.description}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      <dl className="mt-4 grid gap-1 text-xs text-[var(--sea-ink-soft)]">
        <div className="flex gap-2">
          <dt className="font-semibold text-[var(--sea-ink)]">Topic</dt>
          <dd>{resource.topic}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold text-[var(--sea-ink)]">Hours</dt>
          <dd>{resource.estimatedHours}h estimated</dd>
        </div>
      </dl>

      <p className="mt-4 border-t border-[var(--line)] pt-3 text-xs leading-relaxed text-[var(--sea-ink-soft)]">
        Source: {resource.attribution.originalSourceName}
        <span aria-hidden="true"> · </span>
        Curated from {resource.attribution.curatedFromName}
      </p>
    </article>
  );
}
