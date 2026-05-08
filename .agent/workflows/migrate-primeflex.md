---
description: Migrar clases PrimeFlex a Tailwind CSS en templates HTML
---

# Migración PrimeFlex → Tailwind CSS

Cuando edites un template HTML, reemplaza las clases PrimeFlex por sus equivalentes Tailwind.

## Tabla de Mapeo Rápido

### Grid / Layout

| PrimeFlex  | Tailwind                               | Notas                        |
| ---------- | -------------------------------------- | ---------------------------- |
| `grid`     | `grid grid-cols-12` o `flex flex-wrap` | PrimeFlex grid = flex wrap   |
| `col-6`    | `w-1/2`                                | O usar `col-span-6` con grid |
| `col-4`    | `w-1/3`                                |                              |
| `col-3`    | `w-1/4`                                |                              |
| `col-12`   | `w-full`                               |                              |
| `md:col-6` | `md:w-1/2`                             |                              |

### Flexbox

| PrimeFlex     | Tailwind          |
| ------------- | ----------------- |
| `flex`        | `flex` ✅ (igual) |
| `flex-col`    | `flex-col`        |
| `flex-wrap`   | `flex-wrap` ✅    |
| `flex-grow-1` | `grow`            |
| `shrink-0`    | `shrink-0`        |
| `flex-1`      | `flex-1` ✅       |
| `inline-flex` | `inline-flex` ✅  |

### Alignment

| PrimeFlex           | Tailwind          |
| ------------------- | ----------------- |
| `items-center`      | `items-center`    |
| `items-start`       | `items-start`     |
| `items-end`         | `items-end`       |
| `items-stretch`     | `items-stretch`   |
| `align-self-center` | `self-center`     |
| `justify-center`    | `justify-center`  |
| `justify-between`   | `justify-between` |
| `justify-end`       | `justify-end`     |
| `justify-around`    | `justify-around`  |
| `justify-evenly`    | `justify-evenly`  |

### Spacing

| PrimeFlex | Tailwind   | Valor             |
| --------- | ---------- | ----------------- |
| `mb-1`    | `mb-1` ✅  |                   |
| `mb-2`    | `mb-2` ✅  |                   |
| `mb-3`    | `mb-4`     | PF 1rem → TW 1rem |
| `mt-3`    | `mt-4`     |                   |
| `p-3`     | `p-4`      |                   |
| `gap-2`   | `gap-2` ✅ |                   |
| `gap-3`   | `gap-4`    |                   |

### Text

| PrimeFlex                | Tailwind            |
| ------------------------ | ------------------- |
| `text-center`            | `text-center` ✅    |
| `text-left`              | `text-left` ✅      |
| `text-right`             | `text-right` ✅     |
| `font-bold`              | `font-bold` ✅      |
| `font-semibold`          | `font-semibold` ✅  |
| `text-overflow-ellipsis` | `truncate`          |
| `white-space-nowrap`     | `whitespace-nowrap` |

### Surface / Color

| PrimeFlex          | Tailwind                                      |
| ------------------ | --------------------------------------------- |
| `surface-card`     | `bg-white dark:bg-zinc-900`                   |
| `surface-ground`   | `bg-slate-50 dark:bg-zinc-950`                |
| `surface-section`  | `bg-white dark:bg-zinc-900`                   |
| `surface-border`   | `border border-zinc-200 dark:border-zinc-700` |
| `border-round`     | `rounded-md`                                  |
| `border-round-xl`  | `rounded-xl`                                  |
| `border-round-2xl` | `rounded-2xl`                                 |
| `shadow-1`         | `shadow-sm`                                   |
| `shadow-2`         | `shadow`                                      |

### Form

| PrimeFlex          | Tailwind                         |
| ------------------ | -------------------------------- |
| `field`            | `mb-4` (o `flex flex-col gap-1`) |
| `formgroup-inline` | `flex flex-wrap items-end gap-4` |
| `p-fluid`          | `w-full` en inputs               |

### Size

| PrimeFlex | Tailwind    |
| --------- | ----------- |
| `w-full`  | `w-full` ✅ |
| `h-full`  | `h-full` ✅ |

## Proceso

1. Abrir el archivo HTML
2. Buscar clases PrimeFlex (buscar: `align-items-`, `justify-content-`, `flex-col`, `flex-grow`, `surface-`, `border-round`, `formgroup`, `field`)
3. Reemplazar por equivalente Tailwind según la tabla
4. Verificar que el layout no cambió visualmente
