# Patrones de Implementación Ionic

Este documento define los estándares para la integración de componentes Ionic en la aplicación, asegurando consistencia en la vista móvil.

## 1. Listas y Elementos (`ion-item`)

Para renderizar elementos en listas (`app-data-view-mobile`), se debe seguir esta estructura estricta para garantizar la alineación y el comportamiento del `ActionMenu`.

### Estructura Base

```html
<ion-item lines="full" class="ion-no-padding">
  <!-- 1. Avatar o Icono (Inicio) -->
  <ion-avatar slot="start">
    <img [src]="item.photoPath" alt="..." />
  </ion-avatar>

  <!-- 2. Contenido Principal (Texto) -->
  <ion-label>
    <h2 class="font-normal m-0">{{ item.name }}</h2>
    <p class="text-medium text-500 m-0">Detalle adicional</p>
  </ion-label>

  <!-- 3. Acciones (Final) - CRÍTICO -->
  <!-- El ActionMenu DEBE estar envuelto en un div con slot="end" -->
  <div slot="end">
    <app-action-menu>
      <!-- Los botones pueden usarse en modo híbrido según necesidad -->
      <custom-button-edit (clicked)="onEdit(item)" />
      <custom-button-delete (confirmed)="onDelete(item)" />
    </app-action-menu>
  </div>
</ion-item>
```

### Reglas Clave:

1.  **`slot="end"` Wrapper**: El `app-action-menu` _siempre_ debe estar dentro de un `<div slot="end">`. Esto previene que el botón de menú se colapse o desalinee debido al layout flex de `ion-item`.
2.  **`mobileMode` en Botones**:
    - `[mobileMode]="true"` renderizará el botón como un `ion-item` clickable (ideal para listas largas o menús nativos).
    - Sin `mobileMode` (falso), renderizará botones `p-button` estándar.
    - _Nota_: Actualmente se admite una mezcla, pero se prefiere consistencia visual.
3.  **`ion-no-padding`**: Usar en `ion-item` para maximizar el espacio aprovechable, especialmente en listas densas.

## 2. Action Menu

El `app-action-menu` usa internamente `p-popover` (PrimeNG) que ha demostrado ser robusto incluso en móvil.
No es necesario forzar `[mobileMode]="true"` en el `app-action-menu` contenedor si el comportamiento de PrimeNG es satisfactorio.

## 3. Navegación

Evitar `href` o navegación absoluta. Usar `Router` con rutas relativas cuando se está dentro de módulos cargados perezosamente (Lazy Loaded).

```typescript
// Correcto
this.router.navigate(["./detalle"], { relativeTo: this.route });
```
