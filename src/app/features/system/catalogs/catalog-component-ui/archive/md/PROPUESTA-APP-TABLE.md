# Propuesta: `app-table` — Componente tabla dinámico

## Problema

Actualmente cada lista sigue el mismo boilerplate:

```html
<p-table
  [globalFilterFields]="..."
  [paginator]="true"
  [rows]="tablePrimeNgRows"
  [rowsPerPageOptions]="rowsPerPageOptions"
  [showCurrentPageReport]="true"
  [value]="dataSignal()"
  #dt
  currentPageReportTemplate="Mostrando {...}"
  styleClass="custom-table card hidden md:block"
  [scrollable]="true"
  [scrollHeight]="scrollHeight()"
>
  <ng-template #caption>
    <primeng-custom-caption ... />
  </ng-template>
  <ng-template #header>...</ng-template>
  <ng-template #body let-item>...</ng-template>
  <ng-template #emptymessage>...</ng-template>
  <ng-template #paginatorleft>
    <primeng-custom-table-footer [data]="dataSignal()" />
  </ng-template>
</p-table>
```

~40 líneas repetitivas por componente × 385 componentes = mucho ruido.

## Objetivo

Un wrapper `<app-table>` que encapsule el boilerplate y deje solo lo que cambia: columnas, datos, y acciones.

## API propuesta

```html
<app-table
  [data]="dataSignal()"
  [cols]="columns"
  [dt]="dt"
  (add)="onModalForm({id:'', title:'Nuevo'})"
  [globalFilterFields]="globalFilterFields()"
  emptyIcon="mdi:bank-outline"
  emptyTitle="Sin bancos"
  emptyMessage="No hay bancos registrados."
>
  <!-- Columna personalizada (opcional): si cols no basta -->
  <ng-template #customCell let-col="col" let-item="item"> ... </ng-template>
</app-table>
```

### Inputs

| Input                | Tipo                      | Default                            | Descripción                        |
| -------------------- | ------------------------- | ---------------------------------- | ---------------------------------- |
| `data`               | `signal<any[]>` / `any[]` | requerido                          | Datos de la tabla                  |
| `cols`               | `ColDef[]`                | requerido                          | Definición de columnas (ver abajo) |
| `dt`                 | `TemplateRef<any>`        | —                                  | Ref para acceso programático       |
| `globalFilterFields` | `string[]`                | `[]`                               | Campos de filtro global            |
| `scrollable`         | `boolean`                 | `true`                             | Activar scroll                     |
| `scrollHeight`       | `string`                  | `'flex'`                           | Altura scroll                      |
| `paginator`          | `boolean`                 | `true`                             | Mostrar paginador                  |
| `rows`               | `number`                  | `tablePrimeNgRows`                 | Filas por página                   |
| `rowsPerPageOptions` | `number[]`                | `[10,25,50]`                       | Opciones de paginación             |
| `showAdd`            | `boolean`                 | `true`                             | Botón agregar en caption           |
| `addLabel`           | `string`                  | `'Agregar'`                        | Texto botón agregar                |
| `title`              | `string`                  | —                                  | Título opcional en caption         |
| `emptyIcon`          | `string`                  | `'mdi:table-off'`                  | Icono empty state                  |
| `emptyTitle`         | `string`                  | `'Sin registros'`                  | Título empty state                 |
| `emptyMessage`       | `string`                  | `'No hay registros para mostrar.'` | Mensaje empty state                |

### `ColDef`

```typescript
interface ColDef {
  field: string; // nombre de la propiedad
  header: string; // texto del encabezado
  sortable?: boolean; // true por defecto
  style?: string; // style inline para la columna (min-width, etc.)
  class?: string; // clase CSS para td/th
  visible?: boolean; // true por defecto
  // Celda personalizada
  cell?: (item: any) => string | TemplateRef<any>;
}
```

### Template slots (ng-content)

| Slot                         | Propósito                                                     |
| ---------------------------- | ------------------------------------------------------------- |
| `(default)` — sin proyección | Renderiza celdas con `{{ item[field] }}`                      |
| `#customCell`                | Template personalizado para una columna, recibe `{col, item}` |
| `#actions`                   | Template para columna de acciones al final                    |

## Ejemplo de uso

### bank-list.html después

```html
<app-table
  [data]="dataSignal()"
  [cols]="bankColumns"
  [dt]="dt"
  [globalFilterFields]="globalFilterFields()"
  (add)="onModalForm({id:'', title:'Nuevo Registro'})"
  emptyIcon="mdi:bank-outline"
  emptyTitle="Sin bancos"
  emptyMessage="No hay bancos registrados."
>
  <ng-template #actions let-item>
    <custom-button-edit (clicked)="onModalForm({id:item.id, title:'Editar'})" />
    <custom-button-delete (confirmed)="onDelete(item.id)" />
  </ng-template>
</app-table>

<app-data-view-mobile ... />
```

### columns en el .ts

```typescript
bankColumns: ColDef[] = [
  { field: 'code', header: 'Código' },
  { field: 'shortName', header: 'Nombre' },
  { field: 'largeName', header: 'Razón social' },
];
```

### cfdi-use-list.html después

```html
<app-table
  [data]="dataSignal()"
  [cols]="cfdiColumns"
  [dt]="dt"
  [globalFilterFields]="globalFilterFields()"
  title="Usos de CFDI"
  (add)="onModalForm({id:'', title:'Nuevo Registro'})"
  emptyIcon="mdi:receipt-text-outline"
  emptyTitle="Sin usos CFDI"
  emptyMessage="No hay usos de CFDI registrados."
>
  <ng-template #actions let-item>
    <custom-button-edit (clicked)="onModalForm({id:item.id, title:'Editar'})" />
    <custom-button-delete (confirmed)="onDelete(item.id)" />
  </ng-template>
</app-table>

<app-data-view-mobile ... />
```

## Estructura del componente

```
core/components/app-table/
├── app-table.ts          — componente standalone
├── app-table.html        — template con p-table
├── app-table.spec.ts     — tests
└── app-table.types.ts    — ColDef + interfaces
```

## Template del componente (app-table.html)

```html
<p-table
  [value]="data()"
  [globalFilterFields]="globalFilterFields()"
  [scrollable]="scrollable()"
  [scrollHeight]="scrollHeight()"
  [paginator]="paginator()"
  [rows]="rows()"
  [rowsPerPageOptions]="rowsPerPageOptions()"
  [showCurrentPageReport]="true"
  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
  #dt
  styleClass="custom-table card hidden md:block"
>
  <ng-template #caption>
    <primeng-custom-caption
      [title]="title()"
      [showAdd]="showAdd()"
      [label]="addLabel()"
      [dt]="dtRef"
      (add)="add.emit($event)"
    />
  </ng-template>

  <ng-template #header>
    <tr>
      @for (col of cols(); track col.field) {
      <th
        [pSortableColumn]="col.sortable !== false ? col.field : undefined"
        [class]="col.class ?? ''"
        [style]="col.style ?? ''"
      >
        {{ col.header }} @if (col.sortable !== false) {
        <p-sortIcon [field]="col.field" />
        }
      </th>
      } @if (actionsTemplate) {
      <th class="no-print"></th>
      }
    </tr>
  </ng-template>

  <ng-template #body let-item>
    <tr>
      @for (col of cols(); track col.field) {
      <td [class]="col.class ?? ''" [style]="col.style ?? ''">
        @if (col.cell) { {{ col.cell(item) }} } @else { {{ item[col.field] }} }
      </td>
      } @if (actionsTemplate) {
      <td class="no-print">
        <div class="flex">
          <ng-container
            [ngTemplateOutlet]="actionsTemplate"
            [ngTemplateOutletContext]="{$implicit: item}"
          />
        </div>
      </td>
      }
    </tr>
  </ng-template>

  <ng-template #emptymessage>
    <tr>
      <td [attr.colspan]="totalCols()">
        <app-empty-state
          [icon]="emptyIcon()"
          [title]="emptyTitle()"
          [message]="emptyMessage()"
        />
      </td>
    </tr>
  </ng-template>

  <ng-template #paginatorleft>
    <primeng-custom-table-footer [data]="data()" />
  </ng-template>
</p-table>
```

## Notas técnicas (PrimeNG 21)

- **Templates**: `#caption`, `#header`, `#body`, `#paginatorleft` usan el nombre directo. `emptymessage` debe usar `#emptymessage` (no `#emptymessage`) para que PrimeNG 21 lo resuelva correctamente.
- **`p-sortIcon`**: sigue funcionando con `[field]` binding.
- **`pSortableColumn`**: funciona tanto como atributo directo como binding `[pSortableColumn]="field"`.
- **`scrollHeight="flex"`**: recomendado para auto-ajuste responsivo (sin px fijo).
- **`currentPageReportTemplate`**: string con placeholders `{first}`, `{last}`, `{totalRecords}`.
- **`pcPaginator`** (v21): en lugar de `paginatorStyle`, usar pass-through para estilizar el paginador.
- **`tableStyle` vs `styleClass`**: `tableStyle` para estilos inline, `styleClass` para clases CSS (recomendado).

## Consideraciones

1. **`app-data-view-mobile` sigue siendo necesario** — este componente es solo para desktop (`hidden md:block`). La vista móvil se mantiene igual.
2. **Columna de acciones opcional** — se detecta automáticamente si hay contenido proyectado en `#actions`.
3. **`totalCols()`** se calcula como `cols().length + (actionsTemplate ? 1 : 0)`.
4. **Compatibilidad hacia atrás** — componentes existentes pueden migrarse uno por uno sin romper nada.
5. **No reemplaza** `primeng-custom-caption` ni `primeng-custom-table-footer` — los reutiliza internamente.
