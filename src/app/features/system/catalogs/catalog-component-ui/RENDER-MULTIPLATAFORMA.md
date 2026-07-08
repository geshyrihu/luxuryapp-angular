# Cómo renderizar los componentes multiplataforma (verificación en vivo)

> Objetivo: mostrar en el Design System (`/settings/ui-catalog` → pestaña **Web**)
> los nuevos componentes con split **web (`app-*`) + mobile (`ili-*`) + wrapper
> (`lx-*`)**, para verificarlos visualmente redimensionando el navegador.

## Cómo funciona el auto-switch

Cada componente tiene un **wrapper `lx-*`** que usa `PlatformService.isMobile()`:
- **≥ 768 px de ancho** (o no híbrido) → renderiza la versión **web** `app-*` (PrimeNG).
- **< 768 px** (o Capacitor/Ionic nativo) → renderiza la versión **mobile** `ili-*`.

`PlatformService` ya escucha el `resize` del `window`, así que **basta redimensionar
el navegador**: al bajar de 768 px el componente cambia solo a su versión Ionic. Esa
es la forma de verificar sin compilar para móvil.

## Componentes listos para renderizar

| Componente | Wrapper (usar este) | Clase / import |
|---|---|---|
| Empty State | `<lx-empty-state>` | `LxEmptyState` — `src/app/core/components/shared/empty-state/empty-state` |
| Confirm Dialog | `<lx-confirm-dialog>` | `LxConfirmDialog` — `src/app/core/components/shared/confirm-dialog/confirm-dialog` |
| Status Badge | `<lx-status-badge>` | `LxStatusBadge` — `src/app/core/components/shared/status-badge/status-badge` |
| Rating | `<lx-rating>` | `LxRating` — `src/app/core/components/shared/rating/rating` |
| OTP Input | `<lx-otp-input>` | `LxOtpInput` — `src/app/core/components/shared/otp-input/otp-input` |
| Tag Input | `<lx-tag-input>` | `LxTagInput` — `src/app/core/components/shared/tag-input/tag-input` |
| Date Range | `<lx-date-range>` | `LxDateRange` — `src/app/core/components/shared/date-range/date-range` |
| Contact Card | `<lx-contact-card>` | `LxContactCard` — `src/app/core/components/shared/contact-card/contact-card` |
| Profile Card | `<lx-profile-card>` | `LxProfileCard` — `src/app/core/components/shared/profile-card/profile-card` |
| Color Picker | `<lx-color-picker>` | `LxColorPicker` — `src/app/core/components/shared/color-picker/color-picker` |
| Slider | `<lx-slider>` | `LxSlider` — `src/app/core/components/shared/slider/slider` |
| Notification Center | `<lx-notification-center>` | `LxNotificationCenter` — `src/app/core/components/shared/notification-center/notification-center` |
| Breadcrumbs | `<lx-breadcrumbs>` | `LxBreadcrumbs` — `src/app/core/components/shared/breadcrumbs/breadcrumbs` |
| Timeline | `<lx-timeline>` | `LxTimeline` — `src/app/core/components/shared/timeline/timeline` |
| Theme Switcher | `<lx-theme-switcher>` | `LxThemeSwitcher` — `src/app/core/components/shared/theme-switcher/theme-switcher` |
| Lang Selector | `<lx-lang-selector>` | `LxLangSelector` — `src/app/core/components/shared/lang-selector/lang-selector` |
| Comment Thread | `<lx-comment-thread>` | `LxCommentThread` — `src/app/core/components/shared/comment-thread/comment-thread` |

> Esta lista crece. Al completarse nuevos componentes de categoría C (ver
> `core/components/PLAN-WEB-MOBILE-SPLIT.md` → checklist), agregar su `lx-*` al
> showcase de abajo.

## Paso 1 — Crear el componente showcase

Crear el archivo:
`pages/components/catalog-web/components/web-multiplatform/web-multiplatform.ts`

```ts
import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";

import { LxEmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { LxConfirmDialog } from "src/app/core/components/shared/confirm-dialog/confirm-dialog";
import { LxStatusBadge } from "src/app/core/components/shared/status-badge/status-badge";
import { LxRating } from "src/app/core/components/shared/rating/rating";
import { LxOtpInput } from "src/app/core/components/shared/otp-input/otp-input";
import { LxTagInput } from "src/app/core/components/shared/tag-input/tag-input";
import { LxDateRange } from "src/app/core/components/shared/date-range/date-range";
import { DateRangeValue } from "src/app/core/components/web/date-range/date-range";
import { LxContactCard } from "src/app/core/components/shared/contact-card/contact-card";
import { LxProfileCard } from "src/app/core/components/shared/profile-card/profile-card";
import { LxColorPicker } from "src/app/core/components/shared/color-picker/color-picker";
import { LxSlider } from "src/app/core/components/shared/slider/slider";
import { LxNotificationCenter } from "src/app/core/components/shared/notification-center/notification-center";
import { NotificationItem } from "src/app/core/components/web/notification-center/notification-center";
import { LxBreadcrumbs } from "src/app/core/components/shared/breadcrumbs/breadcrumbs";
import { LxTimeline } from "src/app/core/components/shared/timeline/timeline";
import { TimelineEvent } from "src/app/core/components/web/timeline/timeline";
import { LxThemeSwitcher } from "src/app/core/components/shared/theme-switcher/theme-switcher";
import { LxLangSelector } from "src/app/core/components/shared/lang-selector/lang-selector";
import { LxCommentThread } from "src/app/core/components/shared/comment-thread/comment-thread";
import { Comment } from "src/app/core/components/web/comment-thread/comment-thread";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-web-multiplatform",
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DividerModule,
    LxEmptyState,
    LxConfirmDialog,
    LxStatusBadge,
    LxRating,
    LxOtpInput,
    LxTagInput,
    LxDateRange,
    LxContactCard,
    LxProfileCard,
    LxColorPicker,
    LxSlider,
    LxNotificationCenter,
    LxBreadcrumbs,
    LxTimeline,
    LxThemeSwitcher,
    LxLangSelector,
    LxCommentThread,
  ],
  template: `
    <div class="card">
      <div class="card-header"><span class="card-title">Componentes Multiplataforma (web / Ionic)</span></div>
      <div class="card-body">
      <p class="text-sm mb-4" style="color: var(--ds-text-secondary)">
        Cada bloque usa el wrapper <code>lx-*</code>. Redimensiona el navegador a
        menos de <strong>768 px</strong> para ver la versión Ionic (<code>ili-*</code>);
        arriba de 768 px se ve la versión web (<code>app-*</code>).
      </p>

      <div class="grid">
        <!-- Empty State -->
        <div class="col-12 md:col-6">
          <h5>lx-empty-state</h5>
          <lx-empty-state
            icon="mdi:database-off-outline"
            title="Sin registros"
            message="No hay datos disponibles."
            actionLabel="Agregar"
            actionIcon="mdi:plus"
          />
        </div>

        <!-- Status Badge -->
        <div class="col-12 md:col-6">
          <h5>lx-status-badge</h5>
          <div class="flex flex-wrap gap-2 align-items-center">
            <lx-status-badge [status]="0" />
            <lx-status-badge [status]="1" />
            <lx-status-badge [status]="3" />
            <lx-status-badge [status]="4" />
          </div>
        </div>

        <!-- Rating -->
        <div class="col-12 md:col-6">
          <h5>lx-rating</h5>
          <lx-rating [(value)]="ratingValue" label="Calificación" />
          <small>valor: {{ ratingValue() }}</small>
        </div>

        <!-- OTP -->
        <div class="col-12 md:col-6">
          <h5>lx-otp-input</h5>
          <lx-otp-input [(value)]="otpValue" label="Código de verificación" [length]="6" />
          <small>valor: {{ otpValue() }}</small>
        </div>

        <!-- Tag Input -->
        <div class="col-12 md:col-6">
          <h5>lx-tag-input</h5>
          <lx-tag-input
            [(value)]="tags"
            label="Etiquetas"
            [suggestions]="['Angular','Ionic','PrimeNG','Capacitor','RxJS']"
          />
          <small>tags: {{ tags().join(', ') }}</small>
        </div>

        <!-- Date Range -->
        <div class="col-12 md:col-6">
          <h5>lx-date-range</h5>
          <lx-date-range [(value)]="range" />
        </div>

        <!-- Color Picker -->
        <div class="col-12 md:col-6">
          <h5>lx-color-picker</h5>
          <lx-color-picker [(value)]="color" label="Color" />
        </div>

        <!-- Slider -->
        <div class="col-12 md:col-6">
          <h5>lx-slider</h5>
          <lx-slider [(value)]="sliderValue" label="Umbral" suffix="%" />
        </div>

        <!-- Contact Card -->
        <div class="col-12 md:col-6">
          <h5>lx-contact-card</h5>
          <lx-contact-card
            name="Ana García"
            role="Gerente de Ventas"
            company="Luxury BG"
            email="ana@example.com"
            phone="5551234567"
            status="vip"
          />
        </div>

        <!-- Profile Card -->
        <div class="col-12 md:col-6">
          <h5>lx-profile-card</h5>
          <lx-profile-card
            name="Carlos Ruiz"
            role="Administrador"
            email="carlos@example.com"
            phone="5559876543"
            company="Luxury BG"
            badge="Admin"
            [online]="true"
          />
        </div>

        <!-- Notification Center -->
        <div class="col-12 md:col-6">
          <h5>lx-notification-center</h5>
          <lx-notification-center [notifications]="notifs" [unreadCount]="2" />
        </div>

        <!-- Theme Switcher -->
        <div class="col-12 md:col-6">
          <h5>lx-theme-switcher</h5>
          <lx-theme-switcher />
        </div>

        <!-- Lang Selector -->
        <div class="col-12 md:col-6">
          <h5>lx-lang-selector</h5>
          <lx-lang-selector />
        </div>

        <!-- Breadcrumbs -->
        <div class="col-12">
          <h5>lx-breadcrumbs</h5>
          <lx-breadcrumbs [items]="crumbs" [home]="{ icon: 'mdi:home' }" />
        </div>

        <!-- Timeline -->
        <div class="col-12 md:col-6">
          <h5>lx-timeline</h5>
          <lx-timeline [events]="timelineEvents" />
        </div>

        <!-- Comment Thread -->
        <div class="col-12 md:col-6">
          <h5>lx-comment-thread</h5>
          <lx-comment-thread [comments]="comments" />
        </div>

        <!-- Confirm Dialog -->
        <div class="col-12">
          <p-divider />
          <h5>lx-confirm-dialog</h5>
          <p-button label="Abrir confirmación" (onClick)="showConfirm.set(true)" />
          <lx-confirm-dialog
            [(visible)]="showConfirm"
            type="danger"
            title="Eliminar registro"
            message="¿Seguro que deseas eliminar este registro? Esta acción no se puede deshacer."
            (confirm)="onConfirmed()"
          />
          <small class="ml-2">{{ lastAction() }}</small>
        </div>
      </div>
      </div>
    </div>
  `,
})
export class WebMultiplatform {
  showConfirm = signal(false);
  ratingValue = signal<number | undefined>(3);
  otpValue = signal("");
  tags = signal<string[]>(["Angular", "Ionic"]);
  range = signal<DateRangeValue>({ start: null, end: null });
  color = signal("#003d9b");
  sliderValue = signal<number | [number, number]>(40);
  lastAction = signal("");

  notifs: NotificationItem[] = [
    { id: "1", icon: "mdi:information", title: "Nuevo comentario", description: "Ana respondió tu ticket.", time: "hace 5 min", read: false, severity: "info" },
    { id: "2", icon: "mdi:alert", title: "Pago vencido", description: "La factura #123 venció ayer.", time: "hace 2 h", read: false, severity: "warn" },
    { id: "3", icon: "mdi:check-circle", title: "Tarea completada", description: "Mantenimiento preventivo cerrado.", time: "ayer", read: true, severity: "success" },
  ];

  crumbs: MenuItem[] = [
    { label: "Inicio", routerLink: "/" },
    { label: "Catálogos", routerLink: "/settings" },
    { label: "UI", routerLink: "/settings/ui-catalog" },
  ];

  timelineEvents: TimelineEvent[] = [
    { title: "Ticket creado", description: "Se registró el ticket #4821.", date: "10:30", icon: "mdi:plus", color: "var(--ds-primary)" },
    { title: "Asignado a técnico", description: "Juan Pérez tomó el caso.", date: "11:15", icon: "mdi:account", color: "var(--ds-info)" },
    { title: "Resuelto", description: "Cierre confirmado por el residente.", date: "14:40", icon: "mdi:check", color: "var(--ds-success)", badge: "SLA cumplido" },
  ];

  comments: Comment[] = [
    { id: "1", authorName: "Ana García", text: "¿Ya revisaron el presupuesto?", timestamp: "hace 1 h", reactions: [{ emoji: "👍", count: 2 }] },
    { id: "2", authorName: "Carlos Ruiz", text: "Sí, lo aprobé esta mañana.", timestamp: "hace 30 min", edited: true },
  ];

  onConfirmed(): void {
    this.lastAction.set("✔ Confirmado a las " + new Date().toLocaleTimeString());
  }
}
```

## Paso 2 — Registrar en `catalog-web`

En `pages/components/catalog-web/catalog-web.ts`:

1. Agregar el import:
   ```ts
   import { WebMultiplatform } from "./components/web-multiplatform/web-multiplatform";
   ```
2. Agregarlo al array `imports` del `@Component` (junto a `WebIcons`, etc.).

En `pages/components/catalog-web/catalog-web.html`, agregar dentro del `<div class="grid">`:
```html
<div class="col-12"><app-web-multiplatform /></div>
```

## Paso 3 — Verificar

1. `npm start` (o el `ng serve` ya corriendo).
2. Ir a `/settings/ui-catalog` → pestaña **Web**.
3. Bajar el ancho del navegador **por debajo de 768 px** (DevTools responsive o
   arrastrar el borde). Cada `lx-*` debe cambiar a su versión Ionic `ili-*`:
   - `empty-state`: botón pasa a `ion-button`.
   - `confirm-dialog`: pasa de diálogo centrado a **bottom-sheet**.
   - `status-badge`: mismo chip **sin tooltip**.
   - `rating`: estrellas **táctiles** (no `p-rating`).
   - `otp-input`: **cajas nativas** con auto-avance.
   - `tag-input`: **chips nativos** + input táctil (Enter/coma añade).
   - `date-range`: presets con `ion-button`.
   - `color-picker`: `<input type="color">` nativo.
   - `slider`: `ion-range` (con dualKnobs si `range`).
   - `contact-card` / `profile-card`: badge span + acciones táctiles, sin tooltip.
   - `notification-center`: campana abre **bottom-sheet** (no popover).
   - `breadcrumbs`: scroll horizontal nativo con chevrons.
   - `timeline`: timeline vertical nativo.
   - `theme-switcher`: `ion-toggle` (switch) en vez de botón.
   - `lang-selector`: `ion-select` (action-sheet nativo).
   - `comment-thread`: `ion-textarea` + `ion-button`.
4. Reportar cualquier ajuste de estilo/comportamiento de las versiones `ili-*`.

> Si el dev server muestra errores de "export inexistente" tras mover carpetas:
> borrar `.angular/cache` y reiniciar `ng serve`.

## Componentes que NO llevan split (no agregar `lx-*`)

Validados caso por caso — se renderizan igual en ambas plataformas o ya se
auto-adaptan; usar su `app-*` normal:
- **Agnósticos puros** (idénticos web/mobile): `kpi-card`, `stat-card`,
  `avatar-group`, `activity-log`, `order-status`, `gauge`.
- **Ya híbridos** (auto-adaptan internamente vía `PlatformService`): `file-upload`.

## Checklist de verificación

- [ ] empty-state
- [ ] confirm-dialog (bottom-sheet en mobile)
- [ ] status-badge (sin tooltip en mobile)
- [ ] rating (estrellas táctiles)
- [ ] otp-input (cajas nativas, foco automático)
- [ ] tag-input (chips nativos)
- [ ] date-range (presets ion-button)
- [ ] color-picker (input nativo)
- [ ] slider (ion-range)
- [ ] contact-card (badge span, acciones táctiles)
- [ ] profile-card (badge span, acciones táctiles)
- [ ] notification-center (bottom-sheet)
- [ ] breadcrumbs (scroll horizontal)
- [ ] timeline (timeline vertical nativo)
- [ ] theme-switcher (ion-toggle)
- [ ] lang-selector (ion-select)
- [ ] comment-thread (ion-textarea + ion-button)
