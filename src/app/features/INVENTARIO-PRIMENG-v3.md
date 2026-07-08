# Inventario Normalizado de UI Directa en `features/` - v3

> Alcance del barrido: `client/angular/src/app/features/`
> Excluido intencionalmente: `system/catalogs/catalog-component-ui`
> Regla vigente: en `features/` no debe existir uso directo de PrimeNG ni de Ionic. La unica excepcion permitida por ahora es `p-table` y sus templates/directivas de tabla autorizados.

---

## 1. Regla de cumplimiento

### Permitido por excepcion

- `<p-table>`
- `<p-sorticon>`
- `<p-columnfilter>`
- `<p-tablecheckbox>`
- `<p-tableheadercheckbox>`
- `#caption`
- `#header`
- `#body`
- `#emptymessage`
- `#paginatorleft`

### No permitido en `features/`

- Cualquier otro tag `p-*`
- Cualquier tag `ion-*`
- Imports UI directos desde `primeng/*` o `@ionic/angular` dentro de features, salvo los casos tecnicos que no representan render directo de UI y que se revisan por separado

---

## 2. Hallazgos reales del barrido

### HTML con componentes directos no permitidos

- Archivos HTML con al menos una violacion directa: **438**
- Archivos con tags directos de PrimeNG no permitidos: **298**
- Archivos con tags directos de Ionic: **229**
- Tags PrimeNG directos distintos no permitidos detectados: **45**
- Tags Ionic directos distintos detectados: **31**

### TS con imports directos

- Archivos TS de `features/` con imports directos de PrimeNG: **703**
- Archivos TS con imports UI de PrimeNG distintos de `primeng/api` y `primeng/dynamicdialog`: **594**
- Archivos TS con imports directos de Ionic: **178**

### Conclusiones

- El `INVENTARIO-PRIMENG-v2.md` no sirve como backlog final porque mezcla excepciones validas, imports tecnicos, comentarios y conteos historicos.
- El problema principal actual esta en dos frentes:
  - uso directo de PrimeNG visual fuera de `p-table`
  - uso directo de Ionic visual dentro de `features/`

---

## 3. Violaciones PrimeNG reales mas frecuentes en HTML

Estos son los tags directos no permitidos con mayor presencia, fuera del catalogo demo oficial:

| Tag | Ocurrencias |
|---|---:|
| `p-tag` | 306 |
| `p-card` | 154 |
| `p-message` | 78 |
| `p-tab` | 63 |
| `p-tabpanel` | 63 |
| `p-skeleton` | 54 |
| `p-avatar` | 50 |
| `p-image` | 47 |
| `p-progressspinner` | 26 |
| `p-fieldset` | 22 |
| `p-divider` | 18 |
| `p-tabs` | 14 |
| `p-tablist` | 14 |
| `p-tabpanels` | 14 |
| `p-dialog` | 12 |
| `p-checkbox` | 10 |
| `p-fileupload` | 9 |
| `p-drawer` | 8 |
| `p-listbox` | 7 |
| `p-panel` | 6 |

### Otros PrimeNG directos detectados

- `p-rating`
- `p-confirmdialog`
- `p-badge`
- `p-accordion`
- `p-accordiontab`
- `p-popover`
- `p-radiobutton`
- `p-editor`
- `p-toast`
- `p-splitbutton`
- `p-panelmenu`
- `p-steps`
- `p-toolbar`
- `p-carousel`
- `p-chip`
- `p-inputnumber`
- `p-fluid`
- `p-menu`
- `p-select`
- `p-iconfield`
- `p-inputicon`

### Lectura operativa

- `p-tag` y `p-card` son la deuda mas grande por volumen.
- `p-tabs` y su familia son una deuda importante porque suelen implicar composicion visual completa, no solo un control aislado.
- `p-fileupload`, `p-drawer`, `p-dialog`, `p-checkbox` y `p-select` requieren wrapper o excepcion documentada antes de seguir con PrimeNG 22.

---

## 4. Violaciones Ionic reales mas frecuentes en HTML

Los tags `ion-*` tambien violan la regla actual de no usar UI directa en `features/`.

| Tag | Ocurrencias |
|---|---:|
| `ion-label` | 288 |
| `ion-item` | 244 |
| `ion-button` | 44 |
| `ion-list` | 24 |
| `ion-card` | 23 |
| `ion-card-content` | 21 |
| `ion-col` | 20 |
| `ion-list-header` | 20 |
| `ion-badge` | 15 |
| `ion-segment-button` | 13 |
| `ion-segment` | 9 |
| `ion-row` | 9 |
| `ion-avatar` | 8 |
| `ion-grid` | 7 |
| `ion-card-header` | 6 |

### Otros Ionic directos detectados

- `ion-img`
- `ion-chip`
- `ion-note`
- `ion-icon`
- `ion-accordion`
- `ion-accordion-group`
- `ion-item-divider`
- `ion-input-checkbox`
- `ion-input-select`
- `ion-input-toggle`
- `ion-input-text`
- `ion-ripple-effect`
- `ion-card-title`
- `ion-card-subtitle`
- `ion-item-group`
- `ion-text`

### Lectura operativa

- Ionic sigue muy metido en layouts mobile y pantallas legacy.
- `ion-label` + `ion-item` forman la mayor concentracion y probablemente ameritan wrappers base de layout/list item antes de atacar casos puntuales.

---

## 5. Imports directos de PrimeNG en TS

Los modulos con mayor presencia en `features/` son:

| Modulo | Ocurrencias |
|---|---:|
| `primeng/dynamicdialog` | 391 |
| `primeng/table` | 345 |
| `primeng/card` | 234 |
| `primeng/tooltip` | 157 |
| `primeng/tag` | 141 |
| `primeng/message` | 48 |
| `primeng/avatar` | 34 |
| `primeng/api` | 30 |
| `primeng/image` | 28 |
| `primeng/progressspinner` | 22 |
| `primeng/skeleton` | 21 |
| `primeng/divider` | 21 |
| `primeng/button` | 19 |
| `primeng/dialog` | 14 |
| `primeng/tabs` | 14 |
| `primeng/fieldset` | 9 |
| `primeng/drawer` | 8 |
| `primeng/badge` | 7 |
| `primeng/fileupload` | 7 |
| `primeng/checkbox` | 7 |

### Separacion importante

- `primeng/table` no es automaticamente problema si solo respalda `p-table` y sus piezas permitidas.
- `primeng/dynamicdialog` y `primeng/api` son imports tecnicos; no equivalen por si solos a una violacion visual, pero deben revisarse para confirmar que no arrastren UI directa asociada.
- `primeng/card`, `primeng/tag`, `primeng/message`, `primeng/avatar`, `primeng/image`, `primeng/tabs`, `primeng/drawer`, `primeng/fileupload` y `primeng/checkbox` si son deuda directa de abstraccion.

---

## 6. Prioridad recomendada de migracion

Orden sugerido para seguir limpiando sin dispersarnos:

1. `p-tag`
2. `p-card`
3. `ion-item` / `ion-label`
4. `p-message`
5. `p-tabs` + `p-tablist` + `p-tab` + `p-tabpanel` + `p-tabpanels`
6. `p-avatar` / `p-image`
7. `p-dialog` / `p-drawer`
8. `p-fileupload`
9. `p-checkbox`
10. restos de Ionic mobile (`ion-card`, `ion-list`, `ion-button`, `ion-grid`)

### Criterio

- Primero lo mas repetido.
- Luego lo que mas bloquea la estandarizacion de wrappers.
- Despues casos especiales que requieren decidir wrapper nuevo vs excepcion documentada.

---

## 7. Uso recomendado de este inventario

- Tomar este `v3` como backlog operativo.
- No usar `v2` para medir avance de cumplimiento.
- Cada nueva pasada debe reportar:
  - componentes directos de PrimeNG no permitidos
  - componentes directos de Ionic
  - excepciones reales documentadas
  - imports tecnicos separados del render visual

---

## 8. Siguiente accion sugerida

La siguiente etapa con mejor retorno es atacar en este orden:

1. crear o consolidar wrappers para `tag`, `card` y `message`
2. definir wrappers base para bloques Ionic de lista/layout
3. hacer un barrido por familias y no por modulo, empezando por `p-tag` y `p-card`
