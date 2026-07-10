# PLAN DE ACCIÓN PROGRESIVO — Archivo Histórico

> Este archivo archiva las fases completadas del plan de acción.
> El plan vigente está en `PLAN-DE-ACCION.md`.
> Última actualización: 2026-06-27

---

## FASES COMPLETADAS (1–15)

### Fase 1 — Correcciones críticas de tokens ✅
- `--brand-*` → `--ds-*` en todos los archivos
- Luxury Gold contrast corregido
- Colores hardcodeados eliminados en componentes principales

### Fase 2 — Consistencia tipográfica ✅
- Inter + Hanken Grotesk unificados
- Ionic dark mode tipografía integrada
- `--ds-font-family-base` aplicado globalmente

### Fase 3 — Componentes alta prioridad ✅
- `app-empty-state` implementado
- `confirm-dialog` header corregido
- `status-badge` con iconos

### Fases 4–10 — Componentes media/baja prioridad ✅
Implementados ~83 componentes nuevos o mejorados:
Slider, Rating, OTP, ProfileCard, ThemeSwitcher, PipelineCRM, TagInput, ContactCard,
BottomNav, TabBar, StatCard, Changelog, Customer360, PrintView, LangSelector,
CommentThread, EmailPreview, FormBuilder, SignaturePad, ColorPicker, TristateSwitch,
Dock, QRCode, Heatmap, RealtimeIndicator, InventoryLevel, ReceiptScanner, BarcodeInput,
TerritoryMap, BarcodeScanner, Gantt, PivotTable, FocusTrap, y otros.

### Fase 11 — Web inputs con branch mobile ✅ (2026-06-22)
- 12 componentes con `@if (platform.isMobile())` identificados
- Ramas Ionic añadidas para auto-detección de plataforma

### Fase 12 — Limpieza de páginas del catálogo ✅
- `catalog-mobile` integrado
- `catalog-charts` limpiado
- Páginas huérfanas eliminadas

### Fase 13 — Expansión mobile feedback ✅ (2026-06-22)
- MobileCoreCoverage expandido
- 60+ componentes Ionic registrados en catálogo

### Fase 14 — Revisión mobile DataView ✅ (2026-06-22)
- `app-data-view-mobile` (207 archivos) revisado
- Labels en action-menu corregidos

### Fase 15 — DS Infrastructure Cleanup ✅ (2026-06-22 → 2026-06-27)
Detalle completo en `SESION-PROGRESO.md` y `AUDITORIA-COMPLETA.md`.

Resumen:
- Brand rebrand Corporate Integrity System (#003d9b)
- `core/_colors.scss` como única fuente Sass
- Eliminación de ramas Ionic de 12 inputs web
- FloatLabel `variant="on"` en todos los inputs
- `base-input-signal` simplificado + mobileSize signal
- 7 hardcodes resueltos (p-message, p-button, p-card, sidebar, mypreset)
- Auditoría completa ejecutada (16 hallazgos, ver Fase 16 en PLAN-DE-ACCION.md)

---

## Estadísticas acumuladas

| Fase | Período | Cambios principales |
|---|---|---|
| 1-10 | Pre-2026-06-20 | 83+ componentes, tokens base, empty-state, status-badge |
| 11-14 | 2026-06-20/22 | Mobile inputs, catálogo expandido, DataView |
| 15 | 2026-06-22/27 | Brand rebrand, FloatLabel, tokens cleanup, audit |

**Total archivos modificados en todas las fases:** ~120+
**Componentes del catálogo implementados:** ~95
**Hardcodes eliminados:** 15+ (7 en Fase 15, resto en fases anteriores)
