import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { Button } from "#/shared/presentation/ui/button";
import { Input } from "#/shared/presentation/ui/input";
import { Label } from "#/shared/presentation/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/shared/presentation/ui/select";
import type {
  CatalogFilterOptions,
  CatalogListInput,
} from "#/modules/catalog/domain/entities/resource";
import { cn } from "#/shared/utils";

const ALL_FILTER_VALUE = "__all__";
const SEARCH_DEBOUNCE_MS = 300;

type CatalogFiltersProps = {
  filters: CatalogListInput;
  filterOptions: CatalogFilterOptions;
  resultLabel: string;
};

function buildSearch(next: CatalogListInput): CatalogListInput {
  const search: CatalogListInput = {};
  if (next.category) search.category = next.category;
  if (next.level) search.level = next.level;
  if (next.resourceType) search.resourceType = next.resourceType;
  if (next.q) search.q = next.q;
  return search;
}

type CatalogSearchFieldProps = {
  filters: CatalogListInput;
  onApply: (next: CatalogListInput) => void;
};

function CatalogSearchField({ filters, onApply }: CatalogSearchFieldProps) {
  const [value, setValue] = useState(filters.q ?? "");
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  useEffect(() => {
    setValue(filters.q ?? "");
  }, [filters.q]);

  useEffect(() => {
    const trimmed = value.trim();
    const current = filtersRef.current.q?.trim() ?? "";
    if (trimmed === current) {
      return;
    }

    const timer = window.setTimeout(() => {
      onApply({ ...filtersRef.current, q: trimmed || undefined });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [value, onApply]);

  function applyNow() {
    const trimmed = value.trim();
    onApply({ ...filtersRef.current, q: trimmed || undefined });
  }

  return (
    <div className="relative w-full">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--text-muted)]"
        aria-hidden="true"
      />
      <Input
        id="catalog-search"
        type="search"
        placeholder="Search by title, topic, category, or tag"
        className="w-full pl-9"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            applyNow();
          }
        }}
        aria-label="Search catalog"
      />
    </div>
  );
}

export function CatalogFiltersBar({ filters, filterOptions, resultLabel }: CatalogFiltersProps) {
  const navigate = useNavigate();
  const hasFilters = Boolean(
    filters.category || filters.level || filters.resourceType || filters.q,
  );

  const applyFilters = useCallback(
    (next: CatalogListInput) => {
      void navigate({ to: "/", search: buildSearch(next) });
    },
    [navigate],
  );

  return (
    <section className="rise-in mx-auto grid w-full max-w-3xl gap-5" aria-label="Catalog filters">
      <div className="flex flex-wrap justify-center gap-2" aria-label="Catalog categories">
        {filterOptions.categories.map((category) => {
          const isActive = filters.category === category;
          return (
            <Button
              key={category}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={cn(
                "shrink-0",
                isActive
                  ? ""
                  : "border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary-hover)]",
              )}
              onClick={() =>
                applyFilters({
                  ...filters,
                  category: isActive ? undefined : category,
                })
              }
            >
              {category}
            </Button>
          );
        })}
      </div>

      <div className="w-full">
        <CatalogSearchField filters={filters} onApply={applyFilters} />
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{resultLabel}</p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-3">
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

      {hasFilters ? (
        <div className="flex justify-center">
          <Button type="button" variant="outline" size="sm" onClick={() => applyFilters({})}>
            Clear filters
          </Button>
        </div>
      ) : null}
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
  const selectId = `catalog-filter-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="grid gap-2">
      <Label htmlFor={selectId}>{label}</Label>
      <Select
        value={value || ALL_FILTER_VALUE}
        onValueChange={(next) => onSelect(next === ALL_FILTER_VALUE ? "" : next)}
      >
        <SelectTrigger id={selectId} className="w-full">
          <SelectValue placeholder={`All ${label.toLowerCase()}s`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_FILTER_VALUE}>All</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
