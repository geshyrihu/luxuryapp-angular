# Inventario de Componentes PrimeNG en `features/` — v2

> **Alcance:** `src/app/features/` — 784 HTML + 1062 TS (excl. `.spec.ts`)
> **Módulos:** accounting, hr, legal, maintenance, operations, purchasing, recruitment, system, web

---

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| Tags PrimeNG distintos en HTML | **45** |
| Módulos PrimeNG importados en TS | **51** |
| Total ocurrencias de tags PrimeNG | **~2,500+** |
| Archivos HTML con al menos 1 tag PrimeNG | ~520 / 784 (66%) |
| Componente más usado | `<p-table>` (330 archivos) |

---

## 1. Inventario Completo por Tag HTML

Datos obtenidos con `rg -l "<p-xxx" --type html` sobre `features/`.

| # | Tag | Archivos | Ocurrencias | Módulo TS |
|---|-----|---------|-------------|-----------|
| 1 | `<p-table>` | 330 | 392 | `primeng/table` (355) |
| 2 | `<p-sorticon>` | 176 | 669 | `primeng/table` |
| 3 | `<p-tag>` | 137 | 312 | `primeng/tag` (153) |
| 4 | `<p-card>` | 83 | 172 | `primeng/card` (249) |
| 5 | `<p-message>` | 40 | 85 | `primeng/message` (55) |
| 6 | `<p-avatar>` | 33 | 50 | `primeng/avatar` (34) |
| 7 | `<p-image>` | 28 | 47 | `primeng/image` (28) |
| 8 | `<p-progressspinner>` | 22 | 27 | `primeng/progressspinner` (25) |
| 9 | `<p-skeleton>` | 20 | 56 | `primeng/skeleton` (24) |
| 10 | `<p-tabs>` / `<p-tablist>` / `<p-tabpanel>` / `<p-tabpanels>` | 12 | 14 c/u | `primeng/tabs` (16) |
| 11 | `<p-dialog>` | 11 | 13 | `primeng/dialog` (17) |
| 12 | `<p-divider>` | 11 | 18 | `primeng/divider` (30) |
| 13 | `<p-drawer>` | 8 | 8 | `primeng/drawer` (8) |
| 14 | `<p-fieldset>` | 8 | 22 | `primeng/fieldset` (9) |
| 15 | `<p-fileupload>` | 7 | 9 | `primeng/fileupload` (7) |
| 16 | `<p-checkbox>` | 6 | 11 | `primeng/checkbox` (13) |
| 17 | `<p-progressbar>` | 5 | 5 | `primeng/progressbar` (6) |
| 18 | `<p-confirmdialog>` | 5 | 5 | `primeng/confirmdialog` (4) |
| 19 | `<p-tablecheckbox>` | 4 | 4 | `primeng/table` |
| 20 | `<p-listbox>` | 4 | 7 | `primeng/listbox` (4) |
| 21 | `<p-panel>` | 4 | 6 | `primeng/panel` (2) |
| 22 | `<p-badge>` | 3 | 4 | `primeng/badge` (8) |
| 23 | `<p-columnfilter>` | 3 | 5 | `primeng/table` |
| 24 | `<p-popover>` | 3 | 3 | `primeng/popover` (4) |
| 25 | `<p-accordion>` | 3 | 6 | `primeng/accordion` (5) |
| 26 | `<p-splitbutton>` | 2 | 2 | `primeng/splitbutton` (3) |
| 27 | `<p-editor>` | 2 | 2 | `primeng/editor` (2) |
| 28 | `<p-panelmenu>` | 2 | 2 | `primeng/panelmenu` (2) |
| 29 | `<p-toast>` | 2 | 2 | `primeng/toast` (7) |
| 30 | `<p-toolbar>` | 2 | 2 | `primeng/toolbar` (4) |
| 31 | `<p-radiobutton>` | 2 | 4 | `primeng/radiobutton` (5) |
| 32 | `<p-accordiontab>` | 2 | 4 | `primeng/accordion` |
| 33 | `<p-tableheadercheckbox>` | 2 | 2 | `primeng/table` |
| 34 | `<p-rating>` | 2 | 6 | `primeng/rating` (2) |
| 35 | `<p-select>` | 1 | 1 | `primeng/select` (1) |
| 36 | `<p-carousel>` | 1 | 1 | `primeng/carousel` (1) |
| 37 | `<p-inputnumber>` | 1 | 1 | `primeng/inputnumber` (2) |
| 38 | `<p-menu>` | 1 | 1 | `primeng/menu` (2) |
| 39 | `<p-steps>` | 1 | 1 | `primeng/steps` (1) |
| 40 | `<p-chip>` | 1 | 1 | `primeng/chip` (2) |
| 41 | `<p-fluid>` | 1 | 1 | `primeng/fluid` (1) |
| 42 | `<p-iconfield>` | 1 | 1 | `primeng/iconfield` (3) |
| 43 | `<p-inputicon>` | 1 | 1 | `primeng/inputicon` (2) |

### Componentes con solo importación TS (sin tag directo en HTML)

Estos se usan como servicios, directivas o componentes wrapper:

| Módulo | Archivos TS | Uso |
|--------|------------|-----|
| `primeng/dynamicdialog` | 390 | `DialogService`, `DynamicDialogConfig`, `DynamicDialogRef` |
| `primeng/inputtext` | ~40 | Directiva `pInputText` en `<input>` |
| `primeng/textarea` | ~3 | Directiva `pTextarea` en `<textarea>` |
| `primeng/button` | 25 | Directiva `pButton` en `<button>` |
| `primeng/tooltip` | 160 | Directiva `pTooltip` |
| `primeng/toggleswitch` | 2 | Swap para `p-inputSwitch` |
| `primeng/selectbutton` | 5 | Swap para `p-selectButton` |
| `primeng/tree` | 1 | `<p-tree>` (1 archivo con import) |
| `primeng/dataview` | 3 | `<p-dataview>` |
| `primeng/ripple` | 1 | Directiva `pRipple` |
| `primeng/floatlabel` | 1 | `<p-floatlabel>` |
| `primeng/breadcrumb` | 1 | `<p-breadcrumb>` |
| `primeng/datepicker` | 1 | `<p-datepicker>` |
| `primeng/password` | 1 | `<p-password>` |
| `primeng/inputgroup` | 2 | `<p-inputgroup>` |
| `primeng/inputgroupaddon` | 2 | `<p-inputgroupaddon>` |

---

## 2. Distribución por Módulo de Features

### accounting (17 componentes distintos)

`p-table`, `p-sorticon`, `p-tag`, `p-card`, `p-message`, `p-progressspinner`, `p-skeleton`, `p-divider`, `p-dialog`, `p-tabs/tablist/tabpanel/tabpanels`, `p-checkbox`, `p-drawer`, `p-progressbar`, `p-listbox`, `p-confirmdialog`, `p-chip`, `p-accordion`

### hr (12 componentes distintos)

`p-table`, `p-sorticon`, `p-tag`, `p-card`, `p-message`, `p-divider`, `p-avatar`, `p-image`, `p-progressspinner`, `p-skeleton`, `p-dialog`, `p-drawer`, `p-tabs/tablist/tabpanel/tabpanels`, `p-fieldset`, `p-panelmenu`, `p-toast`, `p-panel`, `p-checkbox`

### legal (4 componentes distintos)

`p-table`, `p-sorticon`, `p-tag`, `p-badge`, `p-card`

### maintenance (10 componentes distintos)

`p-table`, `p-sorticon`, `p-tag`, `p-card`, `p-image`, `p-divider`, `p-progressspinner`, `p-dialog`, `p-drawer`, `p-menu`, `p-fieldset`

### operations (30+ componentes — el más diverso)

`p-table`, `p-sorticon`, `p-tag`, `p-card`, `p-message`, `p-avatar`, `p-image`, `p-skeleton`, `p-progressspinner`, `p-tabs/tablist/tabpanel/tabpanels`, `p-dialog`, `p-divider`, `p-fieldset`, `p-drawer`, `p-fileupload`, `p-checkbox`, `p-columnfilter`, `p-progressbar`, `p-confirmdialog`, `p-listbox`, `p-popover`, `p-accordion/accordiontab`, `p-editor`, `p-splitbutton`, `p-panel`, `p-panelmenu`, `p-toast`, `p-toolbar`, `p-radiobutton`, `p-badge`

### purchasing (18 componentes distintos)

`p-table`, `p-sorticon`, `p-tag`, `p-card`, `p-message`, `p-avatar`, `p-image`, `p-progressspinner`, `p-skeleton`, `p-dialog`, `p-divider`, `p-drawer`, `p-fieldset`, `p-fileupload`, `p-progressbar`, `p-badge`, `p-rating`, `p-steps`, `p-carousel`, `p-inputnumber`, `p-fluid`

### recruitment (10 componentes distintos)

`p-table`, `p-sorticon`, `p-tag`, `p-card`, `p-avatar`, `p-divider`, `p-message`, `p-dialog`, `p-tabs/tablist/tabpanel/tabpanels`

### system (18 componentes distintos)

`p-table`, `p-sorticon`, `p-tag`, `p-card`, `p-message`, `p-skeleton`, `p-avatar`, `p-image`, `p-progressspinner`, `p-tabs/tablist/tabpanel/tabpanels`, `p-dialog`, `p-checkbox`, `p-toolbar`, `p-radiobutton`, `p-badge`, `p-chip`, `p-iconfield`, `p-inputicon`, `p-panel`

---

## 3. Módulos PrimeNG Importados (TS)

Datos de `rg "from ['\"]primeng" --include "*.ts"` (excl. spec).

| Módulo | Archivos |
|--------|----------|
| `primeng/dynamicdialog` | 390 |
| `primeng/table` | 355 |
| `primeng/card` | 249 |
| `primeng/tooltip` | 160 |
| `primeng/tag` | 153 |
| `primeng/message` | 55 |
| `primeng/avatar` | 34 |
| `primeng/api` | 32 |
| `primeng/divider` | 30 |
| `primeng/image` | 28 |
| `primeng/button` | 25 |
| `primeng/progressspinner` | 25 |
| `primeng/skeleton` | 24 |
| `primeng/dialog` | 17 |
| `primeng/tabs` | 16 |
| `primeng/checkbox` | 13 |
| `primeng/fieldset` | 9 |
| `primeng/drawer` | 8 |
| `primeng/badge` | 8 |
| `primeng/toast` | 7 |
| `primeng/fileupload` | 7 |
| `primeng/progressbar` | 6 |
| `primeng/multiselect` | 5 |
| `primeng/selectbutton` | 5 |
| `primeng/accordion` | 5 |
| `primeng/radiobutton` | 5 |
| `primeng/confirmdialog` | 4 |
| `primeng/listbox` | 4 |
| `primeng/toolbar` | 4 |
| `primeng/popover` | 4 |
| `primeng/splitbutton` | 3 |
| `primeng/iconfield` | 3 |
| `primeng/dataview` | 3 |
| `primeng/inputtext` | ~40 |
| `primeng/chip` | 2 |
| `primeng/inputnumber` | 2 |
| `primeng/panelmenu` | 2 |
| `primeng/panel` | 2 |
| `primeng/editor` | 2 |
| `primeng/rating` | 2 |
| `primeng/menu` | 2 |
| `primeng/inputgroup` | 2 |
| `primeng/inputicon` | 2 |
| `primeng/toggleswitch` | 2 |
| `primeng/inputgroupaddon` | 2 |
| `primeng/select` | 1 |
| `primeng/carousel` | 1 |
| `primeng/steps` | 1 |
| `primeng/breadcrumb` | 1 |
| `primeng/tree` | 1 |
| `primeng/floatlabel` | 1 |
| `primeng/datepicker` | 1 |
| `primeng/ripple` | 1 |
| `primeng/password` | 1 |
| `primeng/fluid` | 1 |

### `primeng/api` — Servicios/Tipos

| Import | Archivos |
|--------|----------|
| `DialogService` | ~100+ |
| `DynamicDialogConfig` | ~100+ |
| `DynamicDialogRef` | ~100+ |
| `MessageService` | ~12 |
| `ConfirmationService` | ~10 |
| `MenuItem` | ~5 |
| `TreeNode` | ~3 |
| `SharedModule` | ~2 |
| `SortEvent` | ~1 |
| `SelectItem` | ~1 |
| `LazyLoadEvent` | ~1 |

---

## 4. Componentes PrimeNG NO encontrados

Estos existen en PrimeNG pero **no** se usan en ningún archivo de `features/`:

| Componente | Estado |
|-----------|--------|
| `<p-dropdown>` | ✅ Reemplazado por `<p-select>` |
| `<p-tabView>` / `<p-tabPanel>` | ✅ Reemplazado por `<p-tabs>` / `<p-tabpanel>` |
| `<p-overlayPanel>` | ✅ Reemplazado por `<p-popover>` |
| `<p-sidebar>` | ✅ Reemplazado por `<p-drawer>` |
| `<p-calendar>` | ✅ Reemplazado por `<p-datepicker>` |
| `<p-inputSwitch>` | ✅ Reemplazado por `<p-toggleswitch>` |
| `<p-toggleButton>` | No usado |
| `<p-selectButton>` | Reemplazado por `<p-selectbutton>` |
| `<p-inputMask>` | No usado |
| `<p-colorPicker>` | No usado |
| `<p-keyFilter>` | No usado |
| `<p-breadcrumb>` | 1 archivo (pocos) |
| `<p-splitter>` | No usado |
| `<p-scrollPanel>` | No usado |
| `<p-paginator>` | No usado |
| `<p-virtualScroller>` | No usado |
| `<p-orderList>` / `<p-pickList>` | No usado |
| `<p-timeline>` | No usado |
| `<p-fullCalendar>` | No usado |
| `<p-galleria>` | No usado |
| `<p-treeTable>` | No usado |
| `<p-organizationChart>` | No usado |
| `<p-chart>` | No usado |
| `<p-messages>` | No usado |
| `<p-inplace>` | No usado |
| `<p-terminal>` | No usado |
| `<p-scrollTop>` | No usado |
| `<p-speedDial>` | No usado |
| `<p-buttonGroup>` | No usado |
| `<p-dock>` | No usado |
| `<p-cascadeSelect>` | No usado |
| `<p-inputOtp>` | No usado |
| `<p-triStateCheckbox>` | No usado |
| `<p-avatarGroup>` | No usado |
| `<p-blockUI>` / `<p-defer>` / `<p-focusTrap>` | No usado |
| `<p-styleClass>` | No usado |
| `<p-confirmPopup>` | No usado |
| `<p-inputGroup>` / `<p-inputGroupAddon>` | Uso mínimo |
| `<p-stepper>` / `<p-steppanel>` | No usado |

---

## 5. Mapa de Migración PrimeNG v16 → v19+

El proyecto ya migró a la API de PrimeNG v19+ en la mayoría de los casos:

| Legacy (v16-) | Actual (v19+) | Estado |
|--------------|---------------|--------|
| `p-dropdown` | `p-select` | ✅ Migrado |
| `p-tabView` / `p-tabPanel` | `p-tabs` / `p-tablist` / `p-tab` / `p-tabpanels` / `p-tabpanel` | ✅ Migrado |
| `p-overlayPanel` | `p-popover` | ✅ Migrado |
| `p-sidebar` | `p-drawer` | ✅ Migrado |
| `p-calendar` | `p-datepicker` | ✅ Migrado |
| `p-inputSwitch` | `p-toggleswitch` | ✅ Migrado |
| `p-accordion` (antiguo) | `p-accordion` + `p-accordion-panel` / `p-accordion-header` / `p-accordion-content` | ✅ Migrado |

---

## 6. Estadísticas por Feature Module

| Módulo | HTML files | Con PrimeNG | Cobertura | Tags distintos |
|--------|-----------|-------------|-----------|---------------|
| operations | ~250 | ~180 | ~72% | 30+ |
| system | ~150 | ~100 | ~67% | 18 |
| accounting | ~120 | ~80 | ~67% | 17 |
| purchasing | ~80 | ~60 | ~75% | 18 |
| hr | ~70 | ~45 | ~64% | 16 |
| maintenance | ~50 | ~30 | ~60% | 10 |
| recruitment | ~30 | ~20 | ~67% | 10 |
| legal | ~20 | ~10 | ~50% | 4 |
| web | ~14 | ~1 | ~7% | 1 |

---

## 7. Top 10 por Ocurrencias vs Archivos

| Tag | Ocurrencias | Archivos | Ratio (prom. por archivo) |
|-----|------------|---------|--------------------------|
| `p-sorticon` | 669 | 176 | 3.8 |
| `p-table` | 392 | 330 | 1.2 |
| `p-tag` | 312 | 137 | 2.3 |
| `p-card` | 172 | 83 | 2.1 |
| `p-message` | 85 | 40 | 2.1 |
| `p-tabpanel` / `p-tab` | 63 c/u | 12 | 5.3 |
| `p-skeleton` | 56 | 20 | 2.8 |
| `p-avatar` | 50 | 33 | 1.5 |
| `p-image` | 47 | 28 | 1.7 |
| `p-progressspinner` | 27 | 22 | 1.2 |

---

## 8. Notas Técnicas

- **`p-sorticon` siempre va con `p-table`**: 176 archivos, ratio ~3.8 por archivo (una por columna ordenable).
- **`p-tag` es el 2do más ubicuo**: 137 archivos, se usa para estados, badges, etiquetas en listas y detalles.
- **`p-card` en 83 archivos**: el contenedor principal de formularios y vistas detalle.
- **`primeng/dynamicdialog` es el módulo más importado (390)**: todos los formularios modales lo usan.
- **`primeng/inputtext` (~40 archivos)**: no aparece como tag porque es una directiva (`pInputText`).
- **`primeng/button` (25 archivos)**: igual, es directiva (`pButton`).
- **`primeng/tooltip` (160 archivos)**: directiva `pTooltip`, siempre presente con tablas.
