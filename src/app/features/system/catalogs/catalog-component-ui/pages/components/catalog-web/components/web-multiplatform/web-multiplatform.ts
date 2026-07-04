import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";

import { LxEmptyState } from "@ui/adaptive/empty-state/empty-state";
import { LxConfirmDialog } from "@ui/adaptive/confirm-dialog/confirm-dialog";
import { LxStatusBadge } from "@ui/adaptive/status-badge/status-badge";
import { LxRating } from "@ui/adaptive/rating/rating";
import { LxOtpInput } from "@ui/adaptive/otp-input/otp-input";
import { LxTagInput } from "@ui/adaptive/tag-input/tag-input";
import { LxDateRange } from "@ui/adaptive/date-range/date-range";
import { DateRangeValue } from "@ui/web/date-range/date-range";
import { LxContactCard } from "@ui/adaptive/contact-card/contact-card";
import { LxProfileCard } from "@ui/adaptive/profile-card/profile-card";
import { LxColorPicker } from "@ui/adaptive/color-picker/color-picker";
import { LxSlider } from "@ui/adaptive/slider/slider";
import { LxNotificationCenter } from "@ui/adaptive/notification-center/notification-center";
import { NotificationItem } from "@ui/web/notification-center/notification-center";
import { LxBreadcrumbs } from "@ui/adaptive/breadcrumbs/breadcrumbs";
import { LxTimeline } from "@ui/adaptive/timeline/timeline";
import { TimelineEvent } from "@ui/web/timeline/timeline";
import { LxThemeSwitcher } from "@ui/adaptive/theme-switcher/theme-switcher";
import { LxLangSelector } from "@ui/adaptive/lang-selector/lang-selector";
import { LxCommentThread } from "@ui/adaptive/comment-thread/comment-thread";
import { Comment } from "@ui/web/comment-thread/comment-thread";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-web-multiplatform",
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
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
    <p-card header="Componentes Multiplataforma (web / Ionic)">
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
    </p-card>
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
