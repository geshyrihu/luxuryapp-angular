# Plan de Migración de Botones

## Objetivo

Reemplazar `custom-button-*` (legacy) por los nuevos componentes `il-button-*` / `iw-button-*` en **todos los features**, y eliminar la carpeta `legacy/` al finalizar.

## Estado Actual

| Sistema | Ámbito | Imports | Templates | Estado |
|---------|--------|---------|-----------|--------|
| `custom-button-*` | Legacy web | ~250+ archivos | ~600+ ocurrencias | 🏭 Producción |
| `buttons-icon-*` | Shim barrel compat | 1 archivo (catalog) | Solo showcase | 🗑️ Eliminar post-migración |
| `buttons-mobiil` | Legacy mobile | 3 archivos (catalog) | Solo showcase | 🗑️ Eliminar post-migración |
| `web/` (iw / il) | Nuevo web | 0 | 0 | ✅ Destino |
| `mobile/` (ii / ili) | Nuevo mobile | 0 | 0 | ✅ Destino |

## Mapa de Equivalencias

| Legacy (`custom-*`) | Nuevo icon-only (`iw-*`) | Nuevo icon+label (`il-*`) |
|---------------------|--------------------------|---------------------------|
| `custom-button` | `iw-button` | `il-button` |
| `custom-button-add` | `iw-button-add` | `il-button-add` |
| `custom-button-edit` | `iw-button-edit` | `il-button-edit` |
| `custom-button-delete` | `iw-button-delete` | `il-button-delete` |
| `custom-button-save` | `iw-button-save` | `il-button-save` |
| `custom-button-download` | `iw-button-download` | `il-button-download` |
| `custom-button-confirm` | `iw-button-confirm` | `il-button-confirm` |
| `custom-button-send-email` | `iw-button-send-email` | `il-button-send-email` |
| `custom-button-view-pdf` | `iw-button-view-pdf` | `il-button-view-pdf` |
| `custom-button-tracking` | `iw-button-tracking` | `il-button-tracking` |
| `custom-button-item` | — | `il-button-item` |
| `custom-button-active-desactive` | `iw-button-active-desactive` | `il-button-active-desactive` |

### Regla de decisión: ¿icon-only o icon+label?

- **icon-only** (`iw-*`): cuando el botón está en una toolbar, tabla, o espacio reducido. Sin texto visible.
- **icon+label** (`il-*`): cuando el botón tiene `label=""` o está en un formulario visible.

## Fases

### Fase 0 — Precatalogación ✅ (Completada)
- Inventariar todos los usos en `features/` → ~250 archivos
- Mapear equivalencias
- Este documento

### Fase 1 — Core Components
**Archivos:** `core/components/` (excluyendo `buttons/`)

| Archivo | Legacy | Nuevo |
|---------|--------|-------|
| `inputs/web/custom-input-file-signal.ts` | `CustomButtonDelete` | `iw-button-delete` |
| `web/bitacora-filtro-fecha/` | `CustomButtonSave` | `il-button-save` |

**✅ COMPLETADA**

### Fase 2 — Feature por feature (orden sugerido)

Cada feature sigue el mismo patrón:

```
1. Reemplazar import: CustomButtonX → WebButtonLabelX / WebButtonIconX
2. Reemplazar selector en template: custom-button-x → il-button-x / iw-button-x
3. Ajustar inputs si cambió la interfaz
4. ng build para verificar
```

#### Orden recomendado (bajo impacto → alto impacto)

| Fase | Feature | Archivos | Impacto |
|------|---------|----------|---------|
| 2a | `system/catalogs/` + `system/approval-rules/` + `system/asamblea-checklist-template/` | ~20 | Bajo |
| 2b | `system/access/` + `system/ai/` + `system/audit-logs/` | ~30 | Bajo–Medio |
| 2c | `system/gestin-de-cliente/` + `system/infrastructure/` + `system/vault/` + `system/test/` | ~30 | Bajo–Medio |
| 2d | `legal/` | ~15 | Medio |
| 2e | `hr/` | ~30 | Medio |
| 2f | `recruitment/` | ~15 | Medio |
| 2g | `maintenance/` | ~30 | Medio |
| 2h | `purchasing/` | ~20 | Medio–Alto |
| 2i | `operations/` | ~40 | Alto |
| 2j | `accounting/` (incluye contabilidad/cobranza-nativa — el más grande) | ~60 | Muy Alto |

### Fase 3 — Limpieza

Una vez que **ningún archivo** en `src/` importe de:
- `buttons/legacy/`
- `buttons/buttons-icon-*` (barrels viejos)
- `buttons/revisar-si.sirve/`

Se eliminan esas carpetas.

### Fase 4 — Catalog UI Showcase

Actualizar `catalog-component-ui/` para que solo muestre los 2 sistemas vigentes (`web/` y `mobile/`) y elimine las secciones de legacy.

## Notas Técnicas

### Cambios de inputs al migrar

| Input legacy | ¿Existe en nuevo? | Observación |
|-------------|-------------------|-------------|
| `label` | ✅ | Igual |
| `icon` / `iconClass` | ✅ | Igual |
| `severity` | ✅ | Igual |
| `variant` | ✅ | Igual |
| `size` | ✅ | Igual (valores: `sm`, `md`, `lg`) |
| `disabled` | ✅ | Igual |
| `loading` | ✅ | Igual |
| `rounded` | ✅ | Igual |
| `outlined` | ✅ | Igual |
| `text` | ✅ | Igual |
| `plain` | ✅ | Igual |
| `block` / `fluid` | ✅ | Igual |
| `type` | ✅ | Igual |
| `showLabelOnDesktop` | ❌ | **Eliminado** — legacy responsiveness. Usar `il-*` si siempre se requiere label. |
| `tooltip` / `tooltipPosition` / `ariaLabel` | ❌ | **Eliminado** — usar atributos nativos Angular (`[title]`, `[attr.aria-label]`) |
| `submitting` | ✅ | Igual (solo en Save) |
| `propertyId` | ✅ | Igual (solo en Save) |
| `confirmHeader` / `confirmMessage` | ✅ | Igual (solo en Delete) |
| `swalText` | ✅ | Igual (solo en Confirm) |
| `url` / `fileName` | ✅ | Igual (solo en ViewPdf) |
| `badgeCount` / `ticketId` / `trackingTitle` | ✅ | Igual (solo en Tracking) |
| `state` / `activasLabel` / `inactivasLabel` | ✅ | Igual (solo en ActiveDesactive) |
| `emoji` | ✅ | Igual (solo en generic Button, Confirm, Item) |

### Eventos

| Evento legacy | ¿Existe en nuevo? |
|---------------|-------------------|
| `clicked` | ✅ (output) |
| `confirmed` | ✅ (output en Delete, Confirm, SendEmail) |
| `stateChange` | ✅ (output en ActiveDesactive) |
| `clickTracking` | ✅ (output en Tracking) |

### Migración rápida (sed / replace)

Para cada feature, el reemplazo es mecánico:

```bash
# Ejemplo: migrar system/access/
# 1. En TS: CustomButtonSave → WebButtonLabelSave
# 2. En HTML: custom-button-save → il-button-save
# 3. Actualizar import path a buttons/web/label/button-save
```

## Checklist por feature (deglozado)

### Fase 2a — Bajo Impacto

#### system/catalogs/

**banks/**
- [ ] `banks/bank-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `banks/bank-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `banks/bank-form.ts` — `CustomButtonSave` → ...
- [ ] `banks/bank-form.html` — `<custom-button-save>` → ...

**payment-method/**
- [ ] `payment-method/pages/payment-method-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `payment-method/pages/payment-method-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `payment-method/pages/payment-method-form.ts` — `CustomButtonSave` → ...
- [ ] `payment-method/pages/payment-method-form.html` — `<custom-button-save>` → ...

**payment-type/**
- [ ] `payment-type/payment-type-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `payment-type/payment-type-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `payment-type/payment-type-form.ts` — `CustomButtonSave` → ...
- [ ] `payment-type/payment-type-form.html` — `<custom-button-save>` → ...

**product-category/**
- [ ] `product-category/product-category-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `product-category/product-category-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `product-category/product-category-form.ts` — `CustomButtonSave` → ...
- [ ] `product-category/product-category-form.html` — `<custom-button-save>` → ...

**meter-category/**
- [ ] `meter-category/meter-category-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `meter-category/meter-category-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `meter-category/meter-category-form.ts` — `CustomButtonSave` → ...
- [ ] `meter-category/meter-category-form.html` — `<custom-button-save>` → ...

**machinery-classification/**
- [ ] `machinery-classification/machinery-classification-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `machinery-classification/machinery-classification-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `machinery-classification/machinery-classification-form.ts` — `CustomButtonSave` → ...
- [ ] `machinery-classification/machinery-classification-form.html` — `<custom-button-save>` → ...

**units-of-measurement/**
- [ ] `units-of-measurement/unit-of-measurement-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `units-of-measurement/unit-of-measurement-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `units-of-measurement/unit-of-measurement-form.ts` — `CustomButtonSave` → ...
- [ ] `units-of-measurement/unit-of-measurement-form.html` — `<custom-button-save>` → ...

**cfdi-use/**
- [ ] `cfdi-use/pages/cfdi-use-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `cfdi-use/pages/cfdi-use-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `cfdi-use/pages/cfdi-use-form.ts` — `CustomButtonSave` → ...
- [ ] `cfdi-use/pages/cfdi-use-form.html` — `<custom-button-save>` → ...

**approval-rules/** (dentro de catalogs)
- [ ] `approval-rules/pages/approval-rules.ts` — `CustomButtonSave` → ...
- [ ] `approval-rules/pages/approval-rules.html` — `<custom-button-save>` → ...

**catalog-component-ui/** (showcase — migrar al final, Fase 4)
- [ ] `catalog-component-ui/shared/web-core-coverage.ts` — todos los 12 tipos
- [ ] `catalog-component-ui/shared/patterns-kpi/patterns-kpi.ts` — Edit, Delete, ActiveDesactive
- [ ] `catalog-component-ui/pages/catalog-core/catalog-core.ts` — Edit, Delete
- [ ] `catalog-component-ui/pages/catalog-patterns/catalog-patterns.ts` — Edit, Delete
- [ ] `catalog-component-ui/pages/catalog-web/components/web-buttons/web-buttons.ts` — todos los 12 tipos
- [ ] `catalog-component-ui/pages/catalog-web/components/web-badges/web-badges.ts` — Edit, Delete
- [ ] `catalog-component-ui/pages/catalog-web/components/web-tables/web-tables.ts` — Edit, Delete
- [ ] `catalog-component-ui/pages/catalog-web/components/web-overlays/web-overlays.ts` — Edit, Delete
- [ ] `catalog-component-ui/pages/catalog-web-item/catalog-web-item.ts` — todos los 10 tipos
- [ ] `catalog-component-ui/pages/catalog-core-item/catalog-core-item.ts` — Edit, Delete

> **Nota:** `catalog-component-ui/` se migra en Fase 4; hasta entonces puede seguir importando de los shims.

---
**Subtotal catalogs:** ~44 archivos (incluye catalog-component-ui que va en Fase 4)

---

#### system/approval-rules/ (directorio aparte)

- [ ] `approval-rules/pages/approval-rules.ts` — `CustomButtonSave` → ...
- [ ] `approval-rules/pages/approval-rules.html` — `<custom-button-save>` → ...

> **Nota:** Hay DOS copias de approval-rules: `system/catalogs/approval-rules/` y `system/approval-rules/`. Ambas migrar.

---
**Subtotal approval-rules:** 2 archivos

---

#### system/asamblea-checklist-template/

- [ ] `asamblea-checklist-template-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `asamblea-checklist-template-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `asamblea-checklist-template-form.ts` — `CustomButtonSave` → ...
- [ ] `asamblea-checklist-template-form.html` — `<custom-button-save>` → ...

---
**Subtotal asamblea-checklist-template:** 4 archivos

---

### Fase 2b — Bajo–Medio Impacto

#### system/access/

**vault-secrets/**
- [ ] `vault-secrets/vault-secrets-list.ts` — `CustomButton`, `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `vault-secrets/vault-secrets-list.html` — `<custom-button-edit>`, `<custom-button>`, `<custom-button-delete>` (múltiples) → ...
- [ ] `vault-secrets/vault-secret-form.ts` — `CustomButtonSave` → ...
- [ ] `vault-secrets/vault-secret-form.html` — `<custom-button-save>` → ...

**audit-entries/**
- [ ] `audit-entries/audit-entries.ts` — `CustomButton` → ...
- [ ] `audit-entries/audit-entries.html` — `<custom-button>` (×4) → ...

**user-profile/**
- [ ] `user-profile/update-password.ts` — `CustomButtonSave` → ...
- [ ] `user-profile/update-password.html` — `<custom-button-save>` → ...

**application-user/**
- [ ] `application-user/pages/application-user-list.ts` — `CustomButtonEdit`, `CustomButtonDelete`, `CustomButtonItem`, `CustomBtnActiveDesactive` → ...
- [ ] `application-user/pages/application-user-list.html` — `<custom-button-active-desactive>` (×2), `<custom-button-item>` (×6), `<custom-button-edit>`, `<custom-button-delete>` → ...
- [ ] `application-user/pages/application-user-form.ts` — `CustomButtonSave` → ...
- [ ] `application-user/pages/application-user-form.html` — `<custom-button-save>` → ...
- [ ] `application-user/pages/update-password-account.ts` — `CustomButton` → ...
- [ ] `application-user/pages/update-password-account.html` — `<custom-button>` (×4) → ...

**module-app/**
- [ ] `module-app/pages/module-app-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `module-app/pages/module-app-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `module-app/pages/module-app-form.ts` — `CustomButtonSave` → ...
- [ ] `module-app/pages/module-app-form.html` — `<custom-button-save>` → ...

**application-role/**
- [ ] `application-role/pages/roles-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `application-role/pages/roles-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `application-role/pages/role-form.ts` — `CustomButtonSave` → ...
- [ ] `application-role/pages/role-form.html` — `<custom-button-save>` → ...

> **Nota:** `module-app-rol/`, `acceso-customer/`, `profile-users/`, `settings-menu/` no tienen referencias legacy.

---
**Subtotal access:** 22 archivos

---

#### system/ai/

**ai-knowledge-base/**
- [ ] `ai-knowledge-base/ai-knowledge-base-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `ai-knowledge-base/ai-knowledge-base-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `ai-knowledge-base/ai-knowledge-base-form.ts` — `CustomButtonSave` → ...
- [ ] `ai-knowledge-base/ai-knowledge-base-form.html` — `<custom-button-save>` → ...

**knowledge-base/** (copia similar)
- [ ] `knowledge-base/ai-knowledge-base-list.ts` — `CustomButtonEdit`, `CustomButtonDelete` → ...
- [ ] `knowledge-base/ai-knowledge-base-list.html` — `<custom-button-edit>` (×2), `<custom-button-delete>` (×2) → ...
- [ ] `knowledge-base/ai-knowledge-base-form.ts` — `CustomButtonSave` → ...
- [ ] `knowledge-base/ai-knowledge-base-form.html` — `<custom-button-save>` → ...

> **Nota:** `ia-test/` no tiene referencias legacy.

---
**Subtotal ai:** 8 archivos

---

#### system/audit-logs/

- [ ] `user-activity-history/user-activity-history.ts` — `CustomButton` → ...
- [ ] `user-activity-history/user-activity-history.html` — `<custom-button>` (×2) → ...
- [ ] `access-history/bitacora-acceso-list.ts` — `CustomButton` → ...
- [ ] `access-history/bitacora-acceso-list.html` — `<custom-button>` → ...
- [ ] `brevo/brevo-email-logs.ts` — `CustomButton` → ...
- [ ] `brevo/brevo-email-logs.html` — `<custom-button>` (×2) → ...
- [ ] `log-api-report/log-api-report.ts` — `CustomButton` → ...
- [ ] `log-api-report/log-api-report.html` — `<custom-button>` (×3) → ...
- [ ] `app-implementation-tracking/app-implementation-tracking-manual.ts` — `CustomButton`, `<custom-button>` → ...

> **Nota:** `jobs/` no tiene referencias legacy.

---
**Subtotal audit-logs:** 9 archivos

---

### Fase 2c–2j ✅ (Completada)

Todos los `features/` migrados: **0** selectores `custom-button-*` en templates y **0**
imports `CustomButton*`/`CustomBtn*` fuera de `catalog-component-ui/` (showcase, Fase 4).

- [x] `system/gestin-de-cliente/`
- [x] `system/infrastructure/`
- [x] `system/vault/`
- [x] `system/test/`
- [x] `legal/`
- [x] `hr/` — incluye fix de `employees/pages/employee-list.ts` (import roto
      `CustomBtnActiveDesactive` → `WebButtonLabelActiveDesactive`; también se
      restauraron acentos corruptos con bytes NUL)
- [x] `recruitment/`
- [x] `maintenance/`
- [x] `purchasing/`
- [x] `operations/`
- [x] `accounting/` (incluye contabilidad/cobranza-nativa)

> **Pendiente único fuera de Fase 4:** ninguno. El resto de referencias legacy vive
> exclusivamente en `catalog-component-ui/` (showcase), que se migra en Fase 4.

---

### Fase 3 — Limpieza (⛔ bloqueada por Fase 4)

> Los únicos importadores restantes de `legacy/`, `buttons-icon-*` y `buttons-mobiil/`
> son los 10 archivos de `catalog-component-ui/`. No se puede borrar nada hasta que
> Fase 4 los desconecte.

- [ ] Eliminar `legacy/`
- [ ] Eliminar `buttons-icon-*` (shim barrels)
- [ ] Eliminar `revisar-si.sirve/` (shim re-exports)
- [ ] Eliminar `buttons-mobiil/`

### Fase 4 — Catalog UI Showcase (⏳ pendiente — único trabajo restante)

Archivos que aún importan sistemas legacy (showcase side-by-side):

- [ ] `pages/catalog-core/catalog-core.ts`
- [ ] `pages/catalog-core-item/catalog-core-item.ts`
- [ ] `pages/catalog-patterns/catalog-patterns.ts`
- [ ] `pages/catalog-web/components/web-badges/web-badges.ts`
- [ ] `pages/catalog-web/components/web-buttons/web-buttons.ts`
- [ ] `pages/catalog-web/components/web-overlays/web-overlays.ts`
- [ ] `pages/catalog-web/components/web-tables/web-tables.ts`
- [ ] `pages/catalog-web-item/catalog-web-item.ts`
- [ ] `shared/patterns-kpi/patterns-kpi.ts`
- [ ] `shared/web-core-coverage.ts`

- [ ] Actualizar `catalog-component-ui/` para solo mostrar `web/` y `mobile/`

---

> **Leyenda:** `→ ...` significa que la columna "Nuevo" se completa al migrar (ej: `→ il-button-edit` / `→ WebButtonLabelEdit`). Cada archivo debe ser marcado cuando se haya migrado y verificado con `ng build`.
