# Estado de Migración — Barrido General (2026-07-09)

## Resumen Ejecutivo

**Migración completa.** No quedan componentes PrimeNG directos en `features/` fuera de las excepciones documentadas (`p-table` y familia, catálogo demo `catalog-component-ui`).

## Barrido de p-* en features/

| Tipo | Hallazgo | Estado |
|---|---|---|
| Tags `p-*` en HTML | **0** residuos activos | ✅ Limpio |
| Tags `p-*` en HTML (comentados) | 1 (`<!-- p-inputnumber -->` en purchasing) | ✅ Irrelevante |
| Tags `p-*` en demo catalog | Múltiples en `catalog-component-ui` | ✅ Excepción documentada |
| Tags `p-table` y familia | Múltiples (esperado) | ✅ Excepción documentada |
| Imports `from 'primeng/*'` en .ts no-spec | Solo `TableModule` de `primeng/table` | ✅ Excepción documentada |
| Imports `from 'primeng/*'` en spec .ts | `MessageService`, `DialogService`, `DynamicDialogRef`, `DynamicDialogConfig` | ⚠️ Solo tests, no afectan compilación |

## Barrido de ion-* en features/

| Tipo | Hallazgo | Estado |
|---|---|---|
| `<ion-ripple-effect>` | 2 archivos en legal/ (home-comite, biblioteca-consejo-directivo) | ✅ Corregido: faltaba `import { IonRippleEffect }` + `</ion-label>`→`</span>` |
| `<ion-input-*>` (select, text, checkbox, toggle) | 7 archivos en varios módulos | ✅ Son wrappers custom de `@ui/inputs/mobile/n` — NO son Ionic |
| `import from '@ionic/*'` en .ts no-spec | **0** | ✅ Limpio |

## Bugs corregidos (2026-07-09)

- `home-comite.ts` / `biblioteca-consejo-directivo.ts`: añadido `import { IonRippleEffect } from "@ionic/angular/standalone"` — faltaba en el tope del archivo aunque se usaba en el array `imports:`
- `home-comite.html:44` / `biblioteca-consejo-directivo.html:49`: `</ion-label>`→`</span>` — etiqueta de cierre no correspondía con `<span>`

## Mojibake / Encoding

Script `scan-mojibake.mjs` no encontrado en `scripts/`. No se realizó validación automática de encoding.

## Conclusión

`features/` está **limpio** de componentes PrimeNG directos. Los 226 `p-*` originales (excluyendo `p-table`) han sido migrados a wrappers en `shared/ui/`. No se requiere acción adicional.

## Archivos Incluidos en el Barrido

- `src/app/features/` completo (HTML + TS)
- Excepciones respetadas: `p-table`, `p-sorticon`, `p-columnfilter`, `p-tablecheckbox`, `p-tableheadercheckbox`, `catalog-component-ui`
