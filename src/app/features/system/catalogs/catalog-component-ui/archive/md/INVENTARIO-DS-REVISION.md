# INVENTARIO DE REVISIÓN — Design System LuxuryApp

**Fecha de creación:** 2026-06-24
**Actualizado:** 2026-06-27
**Alcance:** 1,075 componentes Angular en `src/app/`
**Objetivo:** Validar que cada componente usa los tokens, wrappers y patrones del Design System establecido.

---

## Criterios de revisión

| Código | Descripción |
|---|---|
| B1 | Botones usan wrapper DS (`custom-button-*`) |
| B1m | Botones en action-menu con `showLabelOnDesktop + label` |
| B2 | Sin botones HTML raw (`<button>` sin DS) |
| I1 | Inputs usan wrapper DS (`custom-input-*-signal`) |
| I2 | Sin inputs raw PrimeNG (`<p-inputtext>`, `<p-select>` directos) |
| T1 | Estilos usan tokens DS (`var(--ds-*)`) |
| T2 | Sin variables `--brand-*` legacy |
| C1 | Status/estados usan `StatusBadge` |
| C2 | Tablas con `PrimeNgCustomCaption` |
| C3 | Listas vacías con `app-empty-state` |
| C4 | Menús de acción con `ActionMenu` |
| M1 | Mobile: plataforma detectada correctamente |
| A1 | Sin colores hardcodeados en template |
| FL | FloatLabel `variant="on"` en inputs de formulario |

**Leyenda:** ⬜ sin revisar · ✅ cumple · ⚠️ parcial · ❌ no cumple

---

## Cambios de criterio (2026-06-27)

### Criterio FL (nuevo)
Después de eliminar las ramas Ionic de `custom-input-*-signal`, el criterio FL verifica que:
- Los inputs en formularios web usen `p-floatlabel variant="on"` (via los wrappers DS)
- NO hay `<p-inputtext>` raw sin wrapper
- NO hay `<ion-input>` en componentes web (solo permitidos en vista mobile Ionic)

### Criterio M1 (actualizado)
Con la eliminación de ramas Ionic en inputs web, `M1` ahora verifica:
- Los componentes de VISTA MOBILE (`/movil/`, `IonPage`) usan `ion-*` correctamente
- Los componentes de VISTA WEB usan PrimeNG con wrappers DS
- No mezcla `<ion-input>` en templates de vista web

---

## Estadísticas actuales

| Métrica | Valor |
|---|---|
| Total componentes | 1,075 |
| Revisados manualmente | ~8 |
| Con violaciones B1 | ~178 |
| Con violaciones I1 | ~107 |
| Con violaciones C3 | ~354 |
| Con violaciones A1 | ~143 |
| Ramas Ionic en inputs web | 0 (resuelto 2026-06-27) |

---

## Componentes completados

### accounting/
- [x] `ar/aspel-customer-empresa/aspel-customer-empresa-list.html` — empty-state añadido
- [x] `ar/catalogo-gastos-fijos/catalogo-gastos-fijos-list.html` — revisado

### (resto pendiente — ver INVENTARIO-COMPONENTES.csv)

---

## Checklist de revisión por componente

Usar este checklist al revisar cada componente en Fase 17:

```markdown
### Componente: [ruta/archivo.html]
- [ ] B1: Reemplazar `<p-button>` por `<custom-button-*>`
- [ ] I1: Reemplazar inputs PrimeNG raw por `<custom-input-*-signal>`
- [ ] FL: Verificar que custom-input usa FloatLabel (automático via wrapper)
- [ ] C3: Si hay `<p-table>`, verificar `<app-empty-state>` en emptymessage
- [ ] A1: Buscar `color:`, `background:`, `#` hardcodeados en style attrs
- [ ] T2: Buscar `--brand-*` (deben ser cero)
- [ ] Build Angular sin errores
- [ ] Verificación visual en browser
- [ ] Commit individual
```

---

## Patrón de grep para detectar violaciones

```powershell
# B1: p-button raw
Select-String -Path "src/app/**/*.html" -Pattern '<p-button' | Where-Object { $_ -notmatch 'custom-button' }

# I1: inputs raw
Select-String -Path "src/app/**/*.html" -Pattern '<p-inputtext|<p-select|<p-inputnumber' | Where-Object { $_ -notmatch 'custom-input' }

# A1: colores hardcodeados en style attr
Select-String -Path "src/app/**/*.html" -Pattern 'style=".*#[0-9a-fA-F]{3,6}'

# Ionic en templates web (NO en /movil/)
Select-String -Path "src/app/**/*.html" -Pattern '<ion-input|<ion-select' | Where-Object { $_ -notmatch '\\movil\\' }
```

---

## Módulos y estado

| Módulo | Componentes | Revisados | Estado |
|---|---|---|---|
| accounting | 94 | 2 | 🔄 En progreso |
| hr | ~120 | 0 | ⬜ Pendiente |
| legal | ~45 | 0 | ⬜ Pendiente |
| maintenance | ~80 | 0 | ⬜ Pendiente |
| operations | ~100 | 0 | ⬜ Pendiente |
| purchasing | ~70 | 0 | ⬜ Pendiente |
| recruitment | ~50 | 0 | ⬜ Pendiente |
| system | ~60 | 0 | ⬜ Pendiente |
| core components | ~456 | ~4 | ⬜ Parcial |
