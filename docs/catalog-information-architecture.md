# Catalog Information Architecture

This document captures the information architecture pattern RutaSec should use for catalog and
library surfaces. It abstracts the ordering model from dense public resource libraries such as
librosgratis.dev without copying their HTML, CSS, content, or visual identity.

## Observed Pattern

The reference page is optimized for browsing a large resource set:

- A minimal utility header appears before content.
- The hero states the collection promise and total resource count.
- The main section is labeled as a library/catalog, not as marketing content.
- Category navigation and search/filter controls appear before the result list.
- Results are grouped by topic/category.
- Each group has a heading, item count, and short editorial description.
- Resource entries are compact: title, source/author, format/type, and direct actions.
- Empty states are plain and tied to the active search or favorites state.

The useful lesson is hierarchy and density: users should understand the catalog, narrow it, and scan
resources quickly.

## RutaSec Model

RutaSec catalog pages should follow this order:

1. Header/navigation for product routes and account actions.
2. Short catalog hero with the learning promise and total count when available.
3. Catalog/library heading.
4. Search, category shortcuts, and filters.
5. Result count plus clear/reset action.
6. Grouped sections by phase, category, topic, or learning path.
7. Compact resource entries with detail/source actions.
8. Empty state for no catalog data or no filtered results.

For resource entries, prioritize:

- Title and RutaSec detail link.
- Category/phase/topic.
- Type, level, estimated hours, and free status.
- Source attribution.
- Visit source and save-to-library actions.

Personal state stays outside editorial metadata: saved status, progress, notes, and goal links belong
to personal library or authenticated surfaces.

## Checklist

Use this checklist before changing catalog or library UI:

- Can a visitor see what the collection is and how many resources it contains quickly?
- Are filters/search/category shortcuts visible before the resource list?
- Is the current result count visible?
- Are resources grouped by a meaningful learning taxonomy when the data supports it?
- Does each group explain its purpose in one sentence?
- Can a user compare resources without opening every detail page?
- Are attribution and source actions preserved?
- Does the empty state tell the user whether the catalog is empty or filters are too narrow?

## Do / Don't

Do:

- Use dense, scannable layouts for full catalog browsing.
- Keep category and taxonomy signals visible.
- Prefer compact resource entries for large result sets.
- Make clear/reset actions obvious when filters are active.
- Preserve shadcn/ui primitives and existing RutaSec theme tokens.

Don't:

- Copy external HTML, CSS, class names, content, or visual identity.
- Put long marketing sections before the resource list.
- Hide all taxonomy inside oversized cards.
- Use card-heavy decoration when a grouped list would scan better.
- Mix editorial resource data with personal user progress.
