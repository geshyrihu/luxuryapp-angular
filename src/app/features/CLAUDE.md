# OpenCode Lane — Plan de Migración UI Abstraída

Trabaja SOLO en este scope:

- `legal/**`
- `purchasing/**`
- `recruitment/**`
- `system/**`
- `hr/**`

No toques nada fuera de estos módulos.
No edites `operations/**`, `maintenance/**`, `accounting/**`.
No toques `system/catalogs/catalog-component-ui`.

## Volumen

| Módulo | p-* | ion-* reales |
|--------|-----|-------------|
| legal | 22 | 3 (`ion-badge`, `ion-ripple-effect`×2) |
| purchasing | 20 | 1 (`ion-badge`) |
| recruitment | 7 | 0 |
| system | 6 | 2 (`ion-input-toggle`×2) |
| hr | 6 | 0 |
| **Total** | **61** | **6** |

## Quick wins (wrapper ya existe — migrar primero)

```
p-tag            → lx-tag
p-badge          → lx-badge
p-skeleton       → lx-skeleton
p-rating         → lx-rating
p-carousel       → lx-carousel
p-confirmdialog  → lx-confirm-dialog
p-toast          → lx-toast
p-fieldset       → lx-fieldset
p-divider        → lx-divider
```

## Bloqueado por wrappers (esperar a KiloCode)

```
p-panelmenu  (hr 2)      → lx-panelmenu
p-inputnumber (purch 1)  → lx-inputnumber
p-steps      (purch 1)   → lx-steps
p-fluid      (purch 1)   → clase utilitaria, revisar antes
```

## Ionic real (mapear después de política definida)

- `legal`: `ion-badge` → `ili-badge`
- `legal`: `ion-ripple-effect`×2 → wrapper móvil
- `system`: `ion-input-toggle`×2 → `ili-input-toggle` o equivalente

## Excepciones permitidas

- `<p-table>`, `<p-sorticon>`, `<p-columnfilter>`, `<p-tablecheckbox>`, `<p-tableheadercheckbox>`
- Templates: `#caption`, `#header`, `#body`, `#emptymessage`, `#paginatorleft`
- `system/catalogs/catalog-component-ui` (demo excluido)

## Reglas

- Usar wrappers existentes antes de crear nuevos
- Si falta wrapper real, documentarlo — NO crearlo (le corresponde a KiloCode)
- No hacer cambios fuera de tu lane
- Preferir `lx-*` (web) sobre `ili-*` (mobile) fuera de `<app-data-view-mobile>`
- No tocar `shared/**` — reportar blockers solamente

## Validaciones mínimas por lote

- `rg <p-(?!(?:table|sorticon|columnfilter|tablecheckbox|tableheadercheckbox)\b)` = 0 en el directorio tocado
- `node scripts/audit-encoding.mjs` o script vigente sobre archivos tocados = 0
- Reportar si quedan violaciones
- Reportar blockers reales

## Orden sugerido

1. `legal/` — quick wins (`p-tag`×21, `p-badge`×1)
2. `purchasing/` — quick wins (`p-rating`×6, `p-fieldset`×6, `p-divider`×3, `p-skeleton`×1, `p-carousel`×1)
3. `hr/` — quick wins (`p-confirmdialog`×2, `p-toast`×2)
4. `recruitment/` — quick wins (`p-divider`×7)
5. `system/` — quick wins (`p-skeleton`×6)
6. Tras wrappers de KiloCode: `p-panelmenu` (hr), `p-inputnumber`/`p-steps` (purchasing)
7. Ionic real: `legal` y `system` (al final, política pendiente)

## Entregable esperado

- Archivos migrados por módulo
- Familias reducidas
- Validación ejecutada
- Blockers reportados
- Actualización breve para agregar al `PLAN-MIGRACION-UI-ABSTRAIDA.md`
