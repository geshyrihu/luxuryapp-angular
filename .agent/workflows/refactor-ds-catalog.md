---
description: Refactor DS catalog page into independent route-level components per sidebar leaf item
---

# Refactor DS Catalog — Group-Item Component Architecture

## Goal

Split the monolithic catalog page into independent route-level components, one per group, where each leaf in `dsMenuItems` (sidebar) navigates to its own URL and renders its own content via `@switch`.

## Architecture

- **Layout shell**: `catalog-layout` — header + `<router-outlet>`
- **10 group-item components** — each handles all leaves of its group via `@switch(item())`

Route pattern: `settings/ui-catalog/:group/:item` (e.g. `settings/ui-catalog/web/accordion`)

## Files & Changes

### 1. Route Config — `src/app/routing/settings.routing.ts`

Replace the old group-level children routes with:

```typescript
children: [
  { path: "", redirectTo: "tokens/colors", pathMatch: "full" },
  { path: "tokens", redirectTo: "tokens/colors" },
  { path: "web", redirectTo: "web/accordion" },
  { path: "mobile", redirectTo: "mobile/buttons" },
  { path: "core", redirectTo: "core/actionmenu" },
  { path: "charts", redirectTo: "charts/bar" },
  { path: "patterns", redirectTo: "patterns/loginreference" },
  { path: "layouts", redirectTo: "layouts/fullwidth" },
  { path: "docs", redirectTo: "docs/documenttypes" },
  { path: "audit", redirectTo: "audit/contentblocks" },
  { path: "guia", redirectTo: "guia/identitypillars" },
  {
    path: "tokens/:item",
    loadComponent: () => import("...catalog-tokens-item/catalog-tokens-item").then(m => m.CatalogTokensItem),
  },
  {
    path: "web/:item",
    loadComponent: () => import("...catalog-web-item/catalog-web-item").then(m => m.CatalogWebItem),
  },
  {
    path: "mobile/:item",
    loadComponent: () => import("...catalog-mobile-item/catalog-mobile-item").then(m => m.CatalogMobileItem),
  },
  {
    path: "core/:item",
    loadComponent: () => import("...catalog-core-item/catalog-core-item").then(m => m.CatalogCoreItem),
  },
  {
    path: "charts/:item",
    loadComponent: () => import("...catalog-charts-item/catalog-charts-item").then(m => m.CatalogChartsItem),
  },
  {
    path: "patterns/:item",
    loadComponent: () => import("...catalog-patterns-item/catalog-patterns-item").then(m => m.CatalogPatternsItem),
  },
  {
    path: "layouts/:item",
    loadComponent: () => import("...catalog-layouts-item/catalog-layouts-item").then(m => m.CatalogLayoutsItem),
  },
  {
    path: "docs/:item",
    loadComponent: () => import("...catalog-docs-item/catalog-docs-item").then(m => m.CatalogDocsItem),
  },
  {
    path: "audit/:item",
    loadComponent: () => import("...catalog-audit-item/catalog-audit-item").then(m => m.CatalogAuditItem),
  },
  {
    path: "guia/:item",
    loadComponent: () => import("...catalog-guia-item/catalog-guia-item").then(m => m.CatalogGuiaItem),
  },
]
```

### 2. Sidebar — `src/app/layout/employee-view/monitor/sidebar/sidebar.ts`

Each leaf in `dsMenuItems` must have a unique `routerLink` with the item name as the last element:

```typescript
routerLink: [...this.catalogBase, 'tokens', 'colors']
routerLink: [...this.catalogBase, 'web', 'accordion']
routerLink: [...this.catalogBase, 'charts', 'bar']
// etc.
```

### 3. Group-Item Components (10 total)

Each reads the `:item` route param reactively and renders content with `@switch`.

**Critical: Use `paramMap.subscribe` not `route.snapshot`** — Angular reuses the component instance when navigating within the same group (e.g. `web/accordion` → `web/badge`), so `snapshot` is stale.

Pattern for ALL item components:

```typescript
private route = inject(ActivatedRoute);
item = signal('');

constructor() {
  this.route.paramMap.subscribe(p => this.item.set(p.get('item') ?? ''));
}
```

And make `label` a getter so it re-evaluates on each change detection:

```typescript
get label(): string { return LABELS[this.item()] ?? this.item(); }
```

#### Component paths and their `@switch` items:

| Component path | Items |
|---|---|
| `pages/catalog-tokens-item/catalog-tokens-item.ts` | `colors`, `typography` |
| `pages/catalog-web-item/catalog-web-item.ts` | `accordion`, `badge`, `breadcrumb`, `button`, `card`, `checkbox`, `datepicker`, `dialog`, `divider`, `inputnumber`, `inputtext`, `message`, `multiselect`, `popover`, `progressbar`, `progressspinner`, `radiobutton`, `select`, `selectbutton`, `skeleton`, `table`, `tabs`, `tag`, `textarea`, `toast`, `toggleswitch`, `toolbar`, `tooltip` |
| `pages/catalog-mobile-item/catalog-mobile-item.ts` | `buttons`, `inputs`, `feedback`, `navigation`, `lists`, `data`, `forms` |
| `pages/catalog-charts-item/catalog-charts-item.ts` | `bar`, `pie`, `line`, `doughnut`, `radar` |
| `pages/catalog-core-item/catalog-core-item.ts` | `actionmenu`, `appicon`, `dataviewmobile`, `loader`, `notificationcenter`, `primengcustomcaption`, `statusbadge`, `wizard`, `emptystate`, `confirmdialog`, `daterange`, `fileupload` |
| `pages/catalog-patterns-item/catalog-patterns-item.ts` | `complexcard`, `datatablehybrid`, `loginreference`, `navigationreference` |
| `pages/catalog-docs-item/catalog-docs-item.ts` | `documenttypes`, `nomenclature`, `accessmatrix` |
| `pages/catalog-audit-item/catalog-audit-item.ts` | `contentblocks`, `quickchecklist` |
| `pages/catalog-layouts-item/catalog-layouts-item.ts` | `fullwidth`, `sidebarcontent`, `masterdetail`, `wizard`, `splitpanels` |
| `pages/catalog-guia-item/catalog-guia-item.ts` | `identitypillars`, `colorvalidation`, `componentcatalog`, `buttonrules`, `referenceform` |

### 4. Handle All Item Components from Previous Work

Some item components were created in a previous session and already exist. They need to be updated to use `paramMap.subscribe` (see pattern above). The `catalog-guia-item` was **missing** and must be created from scratch.

### 5. Index Export — `catalog-component-ui/index.ts`

Must export `CatalogLayout`:

```typescript
export { CatalogLayout } from "./catalog-layout/catalog-layout";
```

## Known Bugs Fixed

### Bug 1: Navigation within same group doesn't re-render
- **Cause**: `route.snapshot.paramMap` is read once during construction. Angular reuses the component instance for same-route-pattern navigation.
- **Fix**: Subscribe to `route.paramMap` observable and set a writable signal.

### Bug 2: Charts (Bar/Pie) show blank
- **Cause**: `CatalogChartsItem` rendered `<app-chart-bar />` and `<app-chart-pie />` **without** `[data]` inputs. The old `CatalogCharts` passed computed data.
- **Fix**: Add `barData` and `pieData` properties and pass them as `[data]="barData"` / `[data]="pieData"`.

### Bug 3: Charts (Line/Doughnut/Radar) show blank
- **Cause**: `chartOptions` was missing the `scales` configuration (x/y ticks and grid colors). The old component used a more complete options object.
- **Fix**: Add `scales` to `chartOptions` and create separate `circularOptions` for doughnut/radar (which don't need scales).

## Build Verification

After all changes, run:
```bash
npm run build
```

Only pre-existing warnings are expected (unused imports, BOM encoding, CSS audit). No new errors.
