# AngulaR Design System — Reglas de Arquitectura

## Jerarquía de Colores (Estricta)

| Archivo | Rol | ¿Puede tener hex/rgba? |
|---------|-----|------------------------|
| `core/_colors.scss` | **Única fuente de verdad** de todos los valores de color | ✅ Sí (SCSS vars `$primary-*`, `$neutral-*`, etc.) |
| `core/_shadows.scss` | **Única fuente de verdad** de sombras | ✅ Sí (SCSS vars `$shadow-*`) |
| `theme/_variables.scss` | Expone `--ds-*` CSS vars en `:root` y `.theme-dark` | ❌ Usa `#{c.$variable}` de _colors.scss |
| **Todo otro `.scss`** | Consume CSS vars únicamente | ❌ Solo `var(--ds-*)` — ni hex, ni rgba |

## Excepciones documentadas

- `_auth.scss`: Glassmorphism theme-independent — los rgba son parte del diseño intencional (no reemplazar).
- `_print.scss`: Estilos solo para impresión — baja prioridad.
- `_utilities.scss`: Solo utilitarios de spacing/tipografía — sin color.

## Commits Previos Relevantes

- `2320a53`: Masiva migración de colores hardcodeados a `var(--ds-*)` en ~40 archivos
- `2320a53`: Eliminación de `_custom-prime-icons.scss`, `_design-system-utilities.scss`, `_loader.scss`
- `2320a53`: Migración `icon-pi-*` → `app-icon` / `pi pi-*` en 14 archivos + HTML/TS
- `2320a53`: Foco shadows unificados en `--ds-shadow-focus*`, toast/alerts con DS tokens

## Recordatorios para el Agente

1. **No usar jamás** `icon-pi-*` en nuevos templates — usar `<app-icon icon="mdi:xxx">` o `pi pi-xxx`.
2. **No añadir colores nuevos** en archivos sueltos — primero a `_colors.scss` como SCSS var, luego a `_variables.scss` como `--ds-*`.
3. **Preferir `var(--ds-primary-text)`** sobre `#ffffff` para texto blanco (se invierte en dark mode).
4. **Sombras de foco**: usar `var(--ds-shadow-focus)` para accesibilidad consistente.
5. **Overlays/masks**: `var(--ds-bg-overlay)` en vez de `rgba(0,0,0,0.45)`.
6. **Ejecutar `ng build` después de cambios en SCSS** para verificar compilación.
