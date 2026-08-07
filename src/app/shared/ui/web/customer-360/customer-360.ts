import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { DividerModule } from "primeng/divider";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export interface Customer360Data {
  // Identity
  name: string;
  role?: string;
  company?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  tags?: string[];
  // Metrics
  totalRevenue?: number;
  openDeals?: number;
  lastContact?: string;
  nps?: number;
  // Activity feed (last 3-5 items)
  recentActivity?: { icon: string; text: string; time: string }[];
  // Open deals summary
  deals?: { title: string; stage: string; value?: number }[];
}

/**
 * AppCustomer360 — Layout completo de vista 360 de cliente CRM.
 * Consolida identidad, métricas clave, actividad reciente y deals abiertos.
 */
@Component({
  selector: "app-customer-360",

  imports: [DividerModule, TagModule, AppIcon],
  template: `
    <div class="c360-root">
      <!-- Header / Identity -->
      <div class="c360-header">
        <div class="c360-avatar" [style.background]="avatarBg()">
          @if (data().avatarUrl) {
            <img
              [src]="data().avatarUrl"
              [alt]="data().name"
              class="c360-avatar-img"
            />
          } @else {
            <span>{{ initials() }}</span>
          }
        </div>
        <div class="c360-identity">
          <h2 class="c360-name">{{ data().name }}</h2>
          @if (data().role) {
            <span class="c360-role">{{ data().role }}</span>
          }
          @if (data().company) {
            <span class="c360-company">
              <app-icon icon="mdi:office-building-outline" class="text-sm" />
              {{ data().company }}
            </span>
          }
          <div class="c360-contact-links">
            @if (data().email) {
              <a [href]="'mailto:' + data().email" class="c360-link">
                <app-icon icon="mdi:email-outline" /> {{ data().email }}
              </a>
            }
            @if (data().phone) {
              <a [href]="'tel:' + data().phone" class="c360-link">
                <app-icon icon="mdi:phone-outline" /> {{ data().phone }}
              </a>
            }
          </div>
          @if (data().tags?.length) {
            <div class="c360-tags">
              @for (tag of data().tags!; track tag) {
                <p-tag
                  [value]="tag"
                  severity="secondary"
                  styleClass="text-xs"
                />
              }
            </div>
          }
        </div>
        <div class="c360-header-actions">
          <button
            class="c360-action"
            (click)="action.emit('email')"
            title="Enviar email"
          >
            <app-icon icon="mdi:email-plus-outline" />
          </button>
          <button
            class="c360-action"
            (click)="action.emit('call')"
            title="Llamar"
          >
            <app-icon icon="mdi:phone-plus-outline" />
          </button>
          <button
            class="c360-action"
            (click)="action.emit('meeting')"
            title="Agendar reunión"
          >
            <app-icon icon="mdi:calendar-plus-outline" />
          </button>
          <button
            class="c360-action"
            (click)="action.emit('note')"
            title="Añadir nota"
          >
            <app-icon icon="mdi:note-plus-outline" />
          </button>
        </div>
      </div>

      <p-divider />

      <!-- Metrics row -->
      <div class="c360-metrics">
        @if (data().totalRevenue !== undefined) {
          <div class="c360-metric">
            <span class="c360-metric-value">{{
              formatCurrency(data().totalRevenue!)
            }}</span>
            <span class="c360-metric-label">Revenue total</span>
          </div>
        }
        @if (data().openDeals !== undefined) {
          <div class="c360-metric">
            <span class="c360-metric-value">{{ data().openDeals }}</span>
            <span class="c360-metric-label">Deals abiertos</span>
          </div>
        }
        @if (data().nps !== undefined) {
          <div class="c360-metric">
            <span
              class="c360-metric-value"
              [class.c360-nps-good]="data().nps! >= 7"
              [class.c360-nps-bad]="data().nps! < 5"
            >
              {{ data().nps }}/10
            </span>
            <span class="c360-metric-label">NPS</span>
          </div>
        }
        @if (data().lastContact) {
          <div class="c360-metric">
            <span class="c360-metric-value">{{ data().lastContact }}</span>
            <span class="c360-metric-label">Último contacto</span>
          </div>
        }
      </div>

      <p-divider />

      <!-- Body: activity + deals -->
      <div class="c360-body">
        <!-- Recent activity -->
        @if (data().recentActivity?.length) {
          <div class="c360-section">
            <h4 class="c360-section-title">
              <app-icon icon="mdi:history" />
              Actividad reciente
            </h4>
            <div class="c360-activity">
              @for (item of data().recentActivity!; track item.text) {
                <div class="c360-activity-item">
                  <div class="c360-activity-icon">
                    <app-icon [icon]="item.icon" />
                  </div>
                  <div class="c360-activity-content">
                    <span class="c360-activity-text">{{ item.text }}</span>
                    <span class="c360-activity-time">{{ item.time }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Open deals -->
        @if (data().deals?.length) {
          <div class="c360-section">
            <h4 class="c360-section-title">
              <app-icon icon="mdi:briefcase-outline" />
              Deals activos
            </h4>
            <div class="c360-deals">
              @for (deal of data().deals!; track deal.title) {
                <div
                  class="c360-deal-row"
                  (click)="action.emit('deal:' + deal.title)"
                >
                  <div>
                    <span class="c360-deal-title">{{ deal.title }}</span>
                    <span class="c360-deal-stage">{{ deal.stage }}</span>
                  </div>
                  @if (deal.value) {
                    <strong class="c360-deal-value">{{
                      formatCurrency(deal.value)
                    }}</strong>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .c360-root {
        background: var(--ds-bg-surface, #fff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-xl, 12px);
        overflow: hidden;
      }
      /* Header */
      .c360-header {
        display: flex;
        gap: 1rem;
        padding: 1.25rem;
        flex-wrap: wrap;
      }
      .c360-avatar {
        flex-shrink: 0;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.375rem;
        font-weight: 700;
        color: #fff;
        overflow: hidden;
      }
      .c360-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .c360-identity {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .c360-name {
        font-size: var(--ds-font-size-section-title, 1.25rem);
        font-weight: 700;
        color: var(--ds-text-primary);
        margin: 0;
      }
      .c360-role {
        font-size: var(--ds-font-size-label, 0.875rem);
        color: var(--ds-text-secondary);
      }
      .c360-company {
        font-size: var(--ds-font-size-label, 0.875rem);
        color: var(--ds-text-muted);
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      .c360-contact-links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 0.25rem;
      }
      .c360-link {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: var(--ds-font-size-help, 0.8125rem);
        color: var(--ds-primary, #003d9b);
        text-decoration: none;
      }
      .c360-link:hover {
        text-decoration: underline;
      }
      .c360-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        margin-top: 0.25rem;
      }
      .c360-header-actions {
        display: flex;
        gap: 0.25rem;
        align-self: flex-start;
      }
      .c360-action {
        width: 32px;
        height: 32px;
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        background: none;
        cursor: pointer;
        color: var(--ds-text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        transition: all 0.15s;
      }
      .c360-action:hover {
        background: var(--ds-bg-elevated);
        color: var(--ds-primary);
        border-color: var(--ds-primary);
      }
      /* Metrics */
      .c360-metrics {
        display: flex;
        flex-wrap: wrap;
        gap: 0;
        padding: 0 1.25rem 1rem;
      }
      .c360-metric {
        flex: 1;
        min-width: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.15rem;
        padding: 0.5rem;
        border-right: 1px solid var(--ds-border, #e2e8f0);
      }
      .c360-metric:last-child {
        border-right: none;
      }
      .c360-metric-value {
        font-size: var(--ds-font-size-card-title, 1rem);
        font-weight: 700;
        color: var(--ds-text-primary);
      }
      .c360-metric-label {
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
        text-align: center;
      }
      .c360-nps-good {
        color: var(--ds-success, #006837);
      }
      .c360-nps-bad {
        color: var(--ds-danger, #ba1a1a);
      }
      /* Body */
      .c360-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
      }
      @media (max-width: 640px) {
        .c360-body {
          grid-template-columns: 1fr;
        }
      }
      .c360-section {
        padding: 1rem 1.25rem;
        border-right: 1px solid var(--ds-border, #e2e8f0);
      }
      .c360-section:last-child {
        border-right: none;
      }
      .c360-section-title {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: var(--ds-font-size-label, 0.875rem);
        font-weight: 600;
        color: var(--ds-text-secondary);
        margin: 0 0 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      /* Activity */
      .c360-activity {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
      }
      .c360-activity-item {
        display: flex;
        gap: 0.625rem;
        align-items: flex-start;
      }
      .c360-activity-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--ds-bg-elevated);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
      }
      .c360-activity-content {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
      }
      .c360-activity-text {
        font-size: var(--ds-font-size-help, 0.8125rem);
        color: var(--ds-text-primary);
      }
      .c360-activity-time {
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
      }
      /* Deals */
      .c360-deals {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .c360-deal-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0.625rem;
        border-radius: var(--ds-radius-sm, 4px);
        cursor: pointer;
        transition: background 0.15s;
      }
      .c360-deal-row:hover {
        background: var(--ds-bg-elevated);
      }
      .c360-deal-title {
        display: block;
        font-size: var(--ds-font-size-help, 0.8125rem);
        font-weight: 600;
        color: var(--ds-text-primary);
      }
      .c360-deal-stage {
        display: block;
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
      }
      .c360-deal-value {
        font-size: var(--ds-font-size-help, 0.8125rem);
        color: var(--ds-primary);
        white-space: nowrap;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppCustomer360 {
  data = input.required<Customer360Data>();
  action = output<string>();

  avatarBg(): string {
    const colors = ["#003d9b", "#006477", "#006837", "#b45309", "#7c3aed"];
    let h = 0;
    for (const c of this.data().name) h = c.charCodeAt(0) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
  }

  initials(): string {
    return this.data()
      .name.split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  formatCurrency(v: number): string {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(v);
  }
}
