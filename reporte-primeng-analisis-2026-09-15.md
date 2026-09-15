# Análisis de Uso de PrimeNG / PrimeIcons / PrimeFlex

- **Fecha de generación:** 2026-09-15T02:42:08Z
- **Árbol de escaneo:** `appsweb/angular/src`
- **Versiones detectadas:**
  - primeng: **22.1.1**
  - primeicons: **8.0.1**
  - primeflex: **4.0.0**

## Resumen Ejecutivo

| Métrica                          | Valor |
|----------------------------------|-------|
| Archivos escaneados              | 4,109 |
| Import paths de PrimeNG únicos   | 122   |
| Tags HTML PrimeNG únicos         | 76    |
| Módulos PrimeNG importados       | 64    |
| Directivas PrimeNG únicas        | 12    |
| Iconos PrimeIcons únicos         | 6     |
| Clases PrimeFlex únicas          | 80    |

---

## 1. Import Paths de PrimeNG (122 únicos)

Los imports más frecuentes:

| Import Path                                  | Ocurrencias |
|----------------------------------------------|-------------|
| `@ui/web/primeng-table/primeng-table`        | 350         |
| `src/app/core/helpers/table-primeng-option`  | 257         |
| `@ui/web/primeng-custom-caption/primeng-custom-caption` | 224  |
| `@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage` | 195 |
| `@ui/web/primeng-custom-table-footer/primeng-custom-table-footer` | 144 |
| `primeng/dynamicdialog`                      | 137         |
| `primeng/api`                                | 92          |
| `@ui/web/primeng-button/primeng-button`      | 24          |
| `@ui/web/primeng-inputtext/primeng-inputtext`| 20          |
| `primeng/button`                             | 36          |
| `@ui/web/primeng-tag/primeng-tag`            | 12          |
| `@ui/web/primeng-message/primeng-message`    | 11          |
| `primeng/table`                              | 8           |
| `primeng/dialog`                             | 7           |
| `primeng/select`                             | 6           |
| `@ui/web/primeng-skeleton/primeng-skeleton`  | 5           |
| `@ui/web/primeng-dialog/primeng-dialog`      | 4           |
| `@ui/web/primeng-checkbox/primeng-checkbox`  | 4           |
| `@ui/web/primeng-select/primeng-select`      | 4           |
| `primeng/inputgroup`                         | 4           |
| `primeng/inputgroupaddon`                    | 4           |
| `primeng/iconfield`                          | 3           |
| `primeng/inputicon`                          | 3           |
| `@ui/web/primeng-progressspinner/primeng-progressspinner` | 3 |
| `primeng/tag`                                | 3           |
| `@ui/web/primeng-selectbutton/primeng-selectbutton` | 3  |
| `@ui/web/primeng-toast/primeng-toast`        | 3           |
| `primeng/fileupload`                         | 3           |
| `primeng/textarea`                           | 3           |
| `primeng/popover`                            | 3           |
| `@ui/web/primeng-divider/primeng-divider`    | 8           |
| `@ui/web/primeng-badge/primeng-badge`        | 2           |
| `@ui/web/primeng-inputgroup/primeng-inputgroup` | 2        |
| `@ui/web/primeng-inputgroupaddon/primeng-inputgroupaddon` | 2 |
| `@ui/web/primeng-iconfield/primeng-iconfield` | 2          |
| `@ui/web/primeng-inputnumber/primeng-inputnumber` | 2      |
| `@ui/web/primeng-multiselect/primeng-multiselect` | 2      |
| `@ui/web/primeng-tabs/primeng-tabs`          | 2           |
| `@ui/web/primeng-toggleswitch/primeng-toggleswitch` | 2    |
| `@ui/web/primeng-dynamicdialog/primeng-dynamicdialog` | 2   |
| `@ui/web/primeng-splitbutton/primeng-splitbutton` | 2      |
| `@ui/web/primeng-menu/primeng-menu`          | 2           |
| `@ui/web/primeng-dataview/primeng-dataview`  | 2           |
| `@ui/web/primeng-avatar/primeng-avatar`      | 2           |
| `primeng/progressbar`                        | 2           |
| `primeng/datepicker`                         | 2           |
| `primeng/editor`                             | 2           |

### Import paths con 1 ocurrencia

| Import Path                                 |
|--------------------------------------------|
| `primeng/config`                           |
| `primeng/confirmdialog`                    |
| `primeng/tooltip`                          |
| `primeng/animateonscroll`                  |
| `primeng/blockui`                          |
| `primeng/tabs`                             |
| `primeng/cascadeselect`                    |
| `primeng/colorpicker`                      |
| `primeng/confirmpopup`                     |
| `primeng/contextmenu`                      |
| `primeng/dataview`                         |
| `primeng/dock`                             |
| `primeng/fieldset`                         |
| `primeng/fluid`                            |
| `primeng/inputnumber`                      |
| `primeng/toggleswitch`                     |
| `primeng/galleria`                         |
| `primeng/message`                          |
| `primeng/image`                            |
| `primeng/inplace`                          |
| `primeng/knob`                             |
| `primeng/listbox`                          |
| `primeng/megamenu`                         |
| `primeng/menubar`                          |
| `primeng/metergroup`                       |
| `primeng/multiselect`                      |
| `primeng/orderlist`                        |
| `primeng/organizationchart`                |
| `primeng/inputotp`                         |
| `primeng/paginator`                        |
| `primeng/panelmenu`                        |
| `primeng/picklist`                         |
| `primeng/toast`                            |
| `primeng/rating`                           |
| `primeng/skeleton`                         |
| `primeng/slider`                           |
| `primeng/splitter`                         |
| `primeng/steps`                            |
| `primeng/styleclass`                       |
| `primeng/autocomplete`                     |
| `primeng/scrolltop`                        |
| `primeng/terminal`                         |
| `primeng/timeline`                         |
| `primeng/tree`                            |
| `primeng/treeselect`                       |
| `primeng/treetable`                        |
| `primeng/scroller`                         |
| `primeng/stepper`                          |

### Imports personalizados (`@ui/web/primeng-*`)

| Import Path                                  | Ocurrencias |
|----------------------------------------------|-------------|
| `@ui/web/primeng-table`                      | 350         |
| `@ui/web/primeng-custom-caption`             | 224         |
| `@ui/web/primeng-custom-table-emptymessage`  | 195         |
| `@ui/web/primeng-custom-table-footer`        | 144         |
| `@ui/web/primeng-button`                     | 24          |
| `@ui/web/primeng-inputtext`                  | 20          |
| `@ui/web/primeng-tag`                        | 12          |
| `@ui/web/primeng-message`                    | 11          |
| `@ui/web/primeng-divider`                    | 8           |
| `@ui/web/primeng-skeleton`                   | 5           |
| `@ui/web/primeng-dialog`                     | 4           |
| `@ui/web/primeng-checkbox`                   | 4           |
| `@ui/web/primeng-select`                     | 4           |
| `@ui/web/primeng-selectbutton`               | 3           |
| `@ui/web/primeng-toast`                      | 3           |
| `@ui/web/primeng-progressspinner`            | 3           |
| `@ui/web/primeng-dynamicdialog`              | 2           |
| `@ui/web/primeng-tabs`                       | 2           |
| `@ui/web/primeng-toggleswitch`               | 2           |
| `@ui/web/primeng-dataview`                   | 2           |
| `@ui/web/primeng-splitbutton`                | 2           |
| `@ui/web/primeng-menu`                       | 2           |
| `@ui/web/primeng-avatar`                     | 2           |
| `@ui/web/primeng-accordion`                  | 1           |
| `@ui/web/primeng-datepicker`                 | 1           |
| `@ui/web/primeng-floatlabel`                 | 1           |
| `@ui/web/primeng-iconfield`                  | 2           |
| `@ui/web/primeng-inputicon`                  | 1           |
| `@ui/web/primeng-inputnumber`                | 2           |
| `@ui/web/primeng-multiselect`                | 2           |
| `@ui/web/primeng-popover`                    | 1           |
| `@ui/web/primeng-toolbar`                    | 1           |
| `@ui/web/primeng-radiobutton`                | 1           |
| `@ui/web/primeng-chip`                       | 1           |
| `@ui/web/primeng-carousel`                   | 1           |

---

## 2. Tags HTML de PrimeNG (76 únicos)

Los tags más frecuentes:

| Tag                   | Ocurrencias |
|-----------------------|-------------|
| `p-table`             | 833         |
| `p-sorticon`          | 734         |
| `p-button`            | 105         |
| `p-dialog`            | 18          |
| `p-skeleton`          | 17          |
| `p-inputgroup-addon`  | 14          |
| `p-tab`               | 11          |
| `p-tabpanel`          | 10          |
| `p-columnfilter`     | 10          |
| `p-inputgroup`        | 10          |
| `p-select`            | 9           |
| `p-card`              | 8           |
| `p-tablecheckbox`     | 7           |
| `p-iconfield`         | 6           |
| `p-accordion-panel`   | 6           |
| `p-accordion-header`  | 6           |
| `p-accordion-content` | 6           |
| `p-popover`           | 6           |
| `p-inputicon`         | 5           |
| `p-tableheadercheckbox` | 5         |
| `p-inputnumber`       | 5           |
| `p-sort`              | 5           |
| `p-fileupload`        | 5           |
| `p-tabs`              | 4           |
| `p-tablist`           | 4           |
| `p-tabpanels`         | 4           |
| `p-toggleswitch`      | 4           |
| `p-datepicker`        | 3           |
| `p-multiselect`       | 3           |
| `p-selectbutton`      | 3           |
| `p-progressbar`       | 3           |
| `p-data`              | 3           |
| `p-editor`            | 3           |
| `p-tree`              | 3           |
| `p-accordion`         | 2           |
| `p-toast`             | 2           |
| `p-dock`              | 2           |
| `p-fieldset`          | 2           |
| `p-fluid`             | 2           |
| `p-galleria`          | 2           |
| `p-message`           | 2           |
| `p-inplace`           | 2           |
| `p-inplace-display`   | 2           |
| `p-inplace-content`   | 2           |
| `p-listbox`           | 2           |
| `p-order`             | 2           |
| `p-panelmenu`         | 2           |
| `p-pick`              | 2           |
| `p-splitter`          | 2           |
| `p-steps`             | 2           |
| `p-scrolltop`         | 2           |
| `p-timeline`          | 2           |
| `p-treetable`         | 2           |
| `p-scroller`          | 2           |
| `p-stepper`           | 2           |
| `p-step-list`         | 2           |
| `p-step`              | 2           |

### Tags con 1 ocurrencia

| Tag                          |
|-----------------------------|
| `p-confirmdialog`           |
| `p-tag`                     |
| `p-block`                   |
| `p-cascade`                 |
| `p-colorpicker`             |
| `p-confirm`                 |
| `p-contextmenu`             |
| `p-image`                   |
| `p-knob`                    |
| `p-megamenu`                |
| `p-menubar`                 |
| `p-meter`                   |
| `p-org`                     |
| `p-inputotp`                |
| `p-paginator`               |
| `p-rating`                  |
| `p-slider`                  |
| `p-autocomplete`            |
| `p-terminal`                |

---

## 3. Módulos PrimeNG Importados (64 únicos)

| Módulo                  | Ocurrencias |
|-------------------------|-------------|
| `ButtonModule`          | 36          |
| `InputTextModule`       | 12          |
| `DialogModule`          | 7           |
| `SelectModule`          | 6           |
| `TableModule`           | 4           |
| `InputGroupModule`      | 4           |
| `InputGroupAddonModule` | 4           |
| `TagModule`             | 3           |
| `FileUploadModule`      | 3           |
| `TextareaModule`        | 3           |
| `PopoverModule`         | 3           |
| `ProgressBarModule`     | 2           |
| `DatePickerModule`      | 2           |
| `EditorModule`          | 2           |
| `IconFieldModule`       | 2           |
| `InputIconModule`       | 2           |

### Módulos con 1 ocurrencia

| Módulo                   |
|--------------------------|
| `ConfirmDialogModule`    |
| `SelectButtonModule`     |
| `SharedModule`           |
| `AnimateOnScrollModule`  |
| `BlockUIModule`          |
| `TabsModule`             |
| `CascadeSelectModule`    |
| `ColorPickerModule`      |
| `ConfirmPopupModule`     |
| `ContextMenuModule`      |
| `DataViewModule`         |
| `DockModule`             |
| `FieldsetModule`         |
| `FluidModule`            |
| `InputNumberModule`      |
| `ToggleSwitchModule`     |
| `GalleriaModule`         |
| `MessageModule`          |
| `ImageModule`            |
| `InplaceModule`          |
| `KnobModule`             |
| `ListboxModule`          |
| `MegaMenuModule`         |
| `MenubarModule`          |
| `MeterGroupModule`       |
| `MultiSelectModule`      |
| `OrderListModule`        |
| `OrganizationChartModule`|
| `InputOtpModule`         |
| `PaginatorModule`        |
| `PanelMenuModule`        |
| `PickListModule`         |
| `ToastModule`            |
| `RatingModule`           |
| `SkeletonModule`         |
| `SliderModule`           |
| `SplitterModule`         |
| `StepsModule`            |
| `StyleClassModule`       |
| `AutoCompleteModule`     |
| `ScrollTopModule`        |
| `TerminalModule`         |
| `TimelineModule`         |
| `TreeModule`             |
| `TreeSelectModule`       |
| `TreeTableModule`        |
| `ScrollerModule`         |
| `StepperModule`          |

---

## 4. Directivas PrimeNG (12 únicas)

| Directiva               | Ocurrencias |
|-------------------------|-------------|
| `pSortableColumn`       | 690         |
| `pFrozenColumn`         | 71          |
| `pTemplate`             | 32          |
| `pRowGroupHeader`       | 30          |
| `pInputText`            | 25          |
| `pReorderableRowHandle` | 9           |
| `pInicial`              | 9           |
| `pButton`               | 7           |
| `pTextarea`             | 3           |
| `pH`                    | 2           |
| `pSize`                 | 2           |
| `pRow`                  | 1           |

---

## 5. PrimeIcons (6 únicos)

| Icono       | Ocurrencias |
|-------------|-------------|
| `pi`        | 37          |
| `pi-spin`   | 6           |
| `pi-plus`   | 4           |
| `pi-trash`  | 2           |
| `pi-spinner`| 1           |
| `pi-nombre` | 1           |

---

## 6. PrimeFlex (80 únicas)

Las clases PrimeFlex más frecuentes:

| Clase                   | Ocurrencias |
|-------------------------|-------------|
| `flex`                  | 3,536       |
| `align-items-center`    | 1,881       |
| `col-12`                | 1,638       |
| `gap-2`                 | 894         |
| `justify-content-between` | 590       |
| `justify-content-center`  | 586       |
| `gap-3`                 | 494         |
| `gap-1`                 | 346         |
| `justify-content-end`   | 198         |
| `col-10`                | 192         |

### Clases PrimeFlex completas

| Clase                             | Ocurrencias |
|-----------------------------------|-------------|
| `flex`                            | 3,536       |
| `align-items-center`              | 1,881       |
| `col-12`                          | 1,638       |
| `gap-2`                           | 894         |
| `justify-content-between`         | 590         |
| `justify-content-center`          | 586         |
| `gap-3`                           | 494         |
| `gap-1`                           | 346         |
| `justify-content-end`             | 198         |
| `col-10`                          | 192         |
| `col-6`                           | 128         |
| `align-items-start`               | 127         |
| `gap-4`                           | 103         |
| `col-5`                           | 101         |
| `col-20`                          | 71          |
| `col-15`                          | 67          |
| `col-4`                           | 59          |
| `col-8`                           | 58          |
| `align-items-end`                 | 51          |
| `col-30`                          | 43          |
| `grid`                            | 41          |
| `align-items-md-center`           | 38          |
| `col-25`                          | 37          |
| `col-40`                          | 34          |
| `justify-content-start`           | 32          |
| `col-2`                           | 31          |
| `col-7`                           | 28          |
| `col-9`                           | 24          |
| `gap-5`                           | 23          |
| `col-50`                          | 20          |
| `col-13`                          | 18          |
| `align-items-lg-center`           | 16          |
| `justify-content-md-between`      | 16          |
| `col-3`                           | 15          |
| `justify-content-lg-between`      | 14          |
| `col-35`                          | 7           |
| `col-45`                          | 7           |
| `gap-0`                           | 5           |
| `align-items-lg-start`            | 5           |
| `justify-content-lg-end`          | 5           |
| `justify-content-md-end`          | 4           |
| `col-17`                          | 4           |
| `align-items-baseline`            | 4           |
| `col-19`                          | 4           |
| `align-self-center`               | 3           |
| `col-28`                          | 3           |
| `align-items-stretch`             | 3           |
| `md:col-6`                        | 3           |
| `lg:col-4`                        | 3           |
| `align-items-md-end`              | 3           |
| `align-items-xl-center`           | 3           |
| `justify-content-xl-between`      | 3           |
| `xl:col-6`                        | 3           |
| `xl:col-12`                       | 3           |
| `col-60`                          | 3           |
| `col-80`                          | 3           |
| `justify-content-sm-start`        | 3           |
| `align-items-sm-center`           | 3           |
| `col-14`                          | 3           |
| `col-70`                          | 2           |
| `align-items-md-start`            | 2           |
| `col-85`                          | 2           |
| `gap-md-5`                        | 2           |
| `col-1`                           | 2           |
| `justify-content-around`          | 2           |
| `align-items-c`                   | 1           |
| `gap-md-4`                        | 1           |
| `xl:col-8`                        | 1           |
| `xl:col-4`                        | 1           |
| `col-34`                          | 1           |
| `col-55`                          | 1           |
| `gap-md-3`                        | 1           |
| `gap-6`                           | 1           |
| `col-32`                          | 1           |
| `align-self-end`                  | 1           |
| `justify-content-md-start`        | 1           |
| `col-16`                          | 1           |
| `col-44`                          | 1           |
| `align-items-lg-end`              | 1           |
| `justify-content-sm-between`      | 1           |

---

## Análisis y Observaciones

### Arquitectura de componentes PrimeNG

El proyecto ha establecido una capa de abstracción significativa sobre PrimeNG:

1. **`@ui/web/primeng-*` wrappers**: 12 componentes personalizados que encapsulan componentes PrimeNG (table, button, dialog, checkbox, select, tag, message, skeleton, divider, inputtext, etc.).
2. **`primeng-custom-*` components**: 4 componentes personalizados para tablas (caption, emptymessage, footer, toast).
3. **Helpers centralizados**: `src/app/core/helpers/table-primeng-option` es el punto único de configuración para opciones de tabla.

### Dominio de PrimeNG

El componente **más utilizado es `p-table`** con:
- 350 imports de `@ui/web/primeng-table`
- 833 tags HTML `<p-table>`
- 4 imports de `TableModule`
- 690 usos de la directiva `pSortableColumn`
- 71 usos de `pFrozenColumn`

Esto confirma que PrimeNG se usa principalmente como sistema de tablas avanzadas.

### PrimeIcons

Uso muy reducido de iconos PrimeIcons:
- Solo 6 iconos únicos detectados
- El más común es `pi` (clase base) con 37 ocurrencias
- `pi-spin` (6) y `pi-plus` (4) son las variantes más usadas
- Posible falsos positivos en `pi-nombre` y `pi-spinner`

### PrimeFlex

Uso extensivo de utilidades de layout:
- **`flex`** es la clase más utilizada (3,536 ocurrencias)
- Sistema de grid basado en **`col-*`** con col-12 dominante (1,638)
- **`align-items-*`** y **`justify-content-*`** son patrones consistentes
- **Responsive breakpoints** presentes: `md:col-*`, `lg:col-*`, `xl:col-*`, `sm:col-*`
- **`gap-*`** sistema de spacing con gap-2, gap-3, gap-1 predominando

---

*Reporte generado automáticamente el 2026-09-15T02:42:08Z mediante escaneo estático del árbol `src`.*