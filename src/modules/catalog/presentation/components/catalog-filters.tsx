import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Layers, Search, X } from "lucide-react";

import type {
  CatalogFilterOptions,
  CatalogListInput,
} from "#/modules/catalog/domain/entities/resource";
import { Button } from "#/shared/presentation/ui/button";
import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "#/shared/presentation/ui/bottom-sheet";
import { Input } from "#/shared/presentation/ui/input";
import { Label } from "#/shared/presentation/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/shared/presentation/ui/select";
import { cn } from "#/shared/utils";

const ALL_FILTER_VALUE = "__all__";
const SEARCH_DEBOUNCE_MS = 300;

const ACTIVE_FILTER_TRIGGER_CLASS =
  "border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary-hover)]";

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
        placeholder="Search resources..."
        className="h-9 w-full pl-9"
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
      void navigate({ to: "/", search: buildSearch(next), resetScroll: false });
    },
    [navigate],
  );

  return (
    <div className="rise-in sticky top-0 z-10 mx-auto flex w-full max-w-full flex-col items-center bg-[var(--background-soft)] border-b border-[var(--border-default)] py-4">
      <section className="max-w-2xl flex flex-col gap-3" aria-label="Catalog filters">
        <div className="flex flex-wrap gap-1.5 justify-center" aria-label="Catalog categories">
          {filterOptions.categories.map((category) => {
            const isActive = filters.category === category;
            return (
              <Button
                key={category}
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 shrink-0 px-2.5 text-xs font-semibold",
                  isActive && ACTIVE_FILTER_TRIGGER_CLASS,
                )}
                aria-pressed={isActive}
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

        <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-2">
          <div className="min-w-0 w-full flex-1">
            <CatalogSearchField filters={filters} onApply={applyFilters} />
            <p className="hidden text-xs mt-1 leading-normal text-[var(--text-secondary)] md:block">
              {resultLabel}
            </p>
          </div>

          <div className="flex min-w-0 w-full items-center gap-2 md:w-auto md:shrink-0">
            <p className="min-w-0 flex-1 truncate text-xs text-[var(--text-secondary)] md:hidden">
              {resultLabel}
            </p>
            <CatalogFilterControls
              filters={filters}
              filterOptions={filterOptions}
              hasFilters={hasFilters}
              onApply={applyFilters}
              className="flex-none shrink-0"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

type CatalogFilterControlsProps = {
  filters: CatalogListInput;
  filterOptions: CatalogFilterOptions;
  hasFilters: boolean;
  onApply: (next: CatalogListInput) => void;
  className?: string;
};

function CatalogFilterControls({
  filters,
  filterOptions,
  hasFilters,
  onApply,
  className,
}: CatalogFilterControlsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <FilterSelect
        label="Type"
        mobileIcon={Layers}
        value={filters.resourceType ?? ""}
        options={filterOptions.resourceTypes.map((value) => ({
          value,
          label: value.charAt(0).toUpperCase() + value.slice(1),
        }))}
        onSelect={(resourceType) =>
          onApply({
            ...filters,
            resourceType: (resourceType || undefined) as CatalogListInput["resourceType"],
          })
        }
      />
      <FilterSelect
        label="Level"
        mobileIcon={BarChart3}
        value={filters.level ?? ""}
        options={filterOptions.levels.map((value) => ({
          value,
          label: value.charAt(0).toUpperCase() + value.slice(1),
        }))}
        onSelect={(level) =>
          onApply({
            ...filters,
            level: (level || undefined) as CatalogListInput["level"],
          })
        }
      />
      {hasFilters ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 shrink-0 p-0 md:w-auto md:px-2.5"
          aria-label="Clear filters"
          onClick={() => onApply({})}
        >
          <X className="size-4 md:hidden" aria-hidden />
          <span className="hidden text-xs md:inline">Clear filters</span>
        </Button>
      ) : null}
    </div>
  );
}

type FilterControlProps = {
  label: string;
  mobileIcon: LucideIcon;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
};

function FilterSelect(props: FilterControlProps) {
  return (
    <>
      <MobileFilterSheet {...props} />
      <DesktopFilterSelect {...props} />
    </>
  );
}

function MobileFilterSheet({
  label,
  mobileIcon: MobileIcon,
  value,
  options,
  onSelect,
}: FilterControlProps) {
  const triggerId = `catalog-filter-${label.toLowerCase().replace(/\s+/g, "-")}-mobile`;
  const isActive = Boolean(value);
  const selectedOption = options.find((option) => option.value === value);
  const filterAriaLabel = selectedOption
    ? `${label}: ${selectedOption.label}`
    : `Filter by ${label.toLowerCase()}`;
  const sheetOptions = [{ value: "", label: "All" }, ...options];

  return (
    <div className="inline-flex shrink-0 items-center md:hidden">
      <BottomSheet>
        <BottomSheetTrigger asChild>
          <Button
            id={triggerId}
            type="button"
            variant="outline"
            size="sm"
            aria-label={filterAriaLabel}
            className={cn("size-8 shrink-0 p-0", isActive && ACTIVE_FILTER_TRIGGER_CLASS)}
          >
            <MobileIcon className="size-4" aria-hidden />
          </Button>
        </BottomSheetTrigger>
        <BottomSheetContent aria-describedby={undefined}>
          <BottomSheetHeader>
            <BottomSheetTitle>{label}</BottomSheetTitle>
          </BottomSheetHeader>
          <div className="flex flex-col gap-1 px-2 pb-4">
            {sheetOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <BottomSheetClose key={option.value || ALL_FILTER_VALUE} asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className={cn(
                      "h-10 w-full justify-start px-3 text-sm font-semibold",
                      isSelected && ACTIVE_FILTER_TRIGGER_CLASS,
                    )}
                    onClick={() => onSelect(option.value)}
                  >
                    {option.label}
                  </Button>
                </BottomSheetClose>
              );
            })}
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  );
}

function DesktopFilterSelect({
  label,
  mobileIcon: MobileIcon,
  value,
  options,
  onSelect,
}: FilterControlProps) {
  const selectId = `catalog-filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const isActive = Boolean(value);
  const selectedOption = options.find((option) => option.value === value);
  const filterAriaLabel = selectedOption
    ? `${label}: ${selectedOption.label}`
    : `Filter by ${label.toLowerCase()}`;
  const showIconOnly = !isActive;

  return (
    <div className="hidden shrink-0 items-center md:inline-flex">
      <Label htmlFor={selectId} className="sr-only">
        {label}
      </Label>
      <Select
        value={value || ALL_FILTER_VALUE}
        onValueChange={(next) => onSelect(next === ALL_FILTER_VALUE ? "" : next)}
      >
        <SelectTrigger
          id={selectId}
          size="sm"
          aria-label={filterAriaLabel}
          className={cn(
            "h-8 min-h-8 shrink-0 text-xs font-semibold",
            showIconOnly
              ? "w-8 min-w-8 max-w-8 justify-center gap-0 p-0 py-0 [&>svg:last-child]:hidden [&_[data-slot=select-value]]:sr-only"
              : "w-fit gap-1.5 px-2.5",
            isActive && ACTIVE_FILTER_TRIGGER_CLASS,
          )}
        >
          {showIconOnly ? (
            <span className="inline-flex size-8 items-center justify-center">
              <MobileIcon className="size-4" aria-hidden />
            </span>
          ) : null}
          <SelectValue placeholder={label} />
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
