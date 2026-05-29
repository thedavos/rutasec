import { useNavigate } from "@tanstack/react-router";

import type {
  CatalogFilterOptions,
  CatalogListInput,
} from "#/modules/catalog/domain/entities/resource";
import { cn } from "#/shared/utils";

type CatalogFiltersProps = {
  filters: CatalogListInput;
  filterOptions: CatalogFilterOptions;
  total: number;
};

function buildSearch(next: CatalogListInput): CatalogListInput {
  const search: CatalogListInput = {};
  if (next.category) search.category = next.category;
  if (next.level) search.level = next.level;
  if (next.resourceType) search.resourceType = next.resourceType;
  return search;
}

export function CatalogFiltersBar({ filters, filterOptions, total }: CatalogFiltersProps) {
  const navigate = useNavigate();
  const hasFilters = Boolean(filters.category || filters.level || filters.resourceType);

  function applyFilters(next: CatalogListInput) {
    void navigate({ to: "/", search: buildSearch(next) });
  }

  return (
    <section className="island-shell rise-in rounded-2xl p-5" aria-label="Catalog filters">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="island-kicker mb-1">Filter catalog</p>
          <p className="text-sm text-[var(--sea-ink-soft)]">
            {total} resource{total === 1 ? "" : "s"} shown
          </p>
        </div>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => applyFilters({})}
            className="rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] hover:border-[var(--lagoon-deep)]"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <FilterSelect
          label="Category"
          value={filters.category ?? ""}
          options={filterOptions.categories.map((value) => ({ value, label: value }))}
          onSelect={(category) =>
            applyFilters({
              ...filters,
              category: category || undefined,
            })
          }
        />
        <FilterSelect
          label="Level"
          value={filters.level ?? ""}
          options={filterOptions.levels.map((value) => ({
            value,
            label: value.charAt(0).toUpperCase() + value.slice(1),
          }))}
          onSelect={(level) =>
            applyFilters({
              ...filters,
              level: (level || undefined) as CatalogListInput["level"],
            })
          }
        />
        <FilterSelect
          label="Type"
          value={filters.resourceType ?? ""}
          options={filterOptions.resourceTypes.map((value) => ({
            value,
            label: value.charAt(0).toUpperCase() + value.slice(1),
          }))}
          onSelect={(resourceType) =>
            applyFilters({
              ...filters,
              resourceType: (resourceType || undefined) as CatalogListInput["resourceType"],
            })
          }
        />
      </div>
    </section>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
};

function FilterSelect({ label, value, options, onSelect }: FilterSelectProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-[var(--sea-ink)]">{label}</span>
      <select
        className={cn(
          "w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2",
          "text-sm text-[var(--sea-ink)] outline-none focus:border-[var(--lagoon-deep)]",
        )}
        value={value}
        onChange={(event) => onSelect(event.target.value)}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
