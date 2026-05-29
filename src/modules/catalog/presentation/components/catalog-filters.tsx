import { useNavigate } from "@tanstack/react-router";

import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader } from "#/components/ui/card";
import { Label } from "#/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import type {
  CatalogFilterOptions,
  CatalogListInput,
} from "#/modules/catalog/domain/entities/resource";

const ALL_FILTER_VALUE = "__all__";

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

      <CardContent className="grid gap-4 px-5 pt-4 pb-5 sm:grid-cols-3">
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
