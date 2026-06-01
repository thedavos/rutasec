import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "#/shared/presentation/ui/button";
import { Card, CardContent, CardHeader } from "#/shared/presentation/ui/card";
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

const ALL_FILTER_VALUE = "__all__";
const SEARCH_DEBOUNCE_MS = 300;

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
    <div className="grid gap-2">
      <Label htmlFor="catalog-search">Search</Label>
      <Input
        id="catalog-search"
        type="search"
        placeholder="Search by title, topic, category, or tag"
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

export function CatalogFiltersBar({ filters, filterOptions, total }: CatalogFiltersProps) {
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
    <Card
      className="island-shell rise-in rounded-2xl border-[var(--line)] py-0 shadow-none"
      aria-label="Catalog filters"
    >
      <CardHeader className="gap-4 px-5 pt-5 pb-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="island-kicker mb-1">Filter catalog</p>
            <p className="text-sm text-[var(--sea-ink-soft)]">
              {total} resource{total === 1 ? "" : "s"} shown
            </p>
          </div>
          {hasFilters ? (
            <Button type="button" variant="outline" size="sm" onClick={() => applyFilters({})}>
              Clear filters
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 px-5 pt-4 pb-5">
        <CatalogSearchField filters={filters} onApply={applyFilters} />
        <div className="grid gap-4 sm:grid-cols-3">
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
      </CardContent>
    </Card>
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
