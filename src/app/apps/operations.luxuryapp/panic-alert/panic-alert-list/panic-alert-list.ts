import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { PanicAlertDto } from "../interfaces/panic-alert.dto";
import { PanicAlertResolveDto } from "../interfaces/panic-alert-resolve.dto";

@Component({
  selector: "app-panic-alert-list",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panic-list-page">
      <h2 class="panic-list-page__title">
        <app-icon icon="mdi:alert-circle" class="text-red-600 mr-2" />
        Alertas de Pánico
      </h2>

      <!-- Alertas activas -->
      <section class="panic-list-section">
        <h3 class="panic-list-section__subtitle">Activas</h3>
        @if (activeAlerts().length === 0) {
        <p class="panic-list-empty">No hay alertas activas en este momento.</p>
        } @else {
        <div class="panic-list">
          @for (alert of activeAlerts(); track alert.id) {
          <div class="panic-card panic-card--active">
            <div class="panic-card__header">
              <app-icon icon="mdi:alert-circle" class="panic-card__status-icon panic-card__status-icon--active" />
              <div>
                <span class="panic-card__name">{{ alert.triggeredByName }}</span>
                <span class="panic-card__time">{{ formatTime(alert.createdAt) }}</span>
              </div>
            </div>
            @if (alert.message) {
            <p class="panic-card__message">{{ alert.message }}</p>
            }
            @if (alert.latitude && alert.longitude) {
            <a class="panic-card__map" [href]="getMapUrl(alert)" target="_blank" rel="noopener">
              <app-icon icon="mdi:map-marker" class="text-sm" />
              Ver ubicación
            </a>
            }
            <div class="panic-card__actions">
              <button type="button" class="panic-card__btn panic-card__btn--attend" (click)="onAttend(alert)">
                <app-icon icon="mdi:check-circle" />
                Atender
              </button>
              <button type="button" class="panic-card__btn panic-card__btn--resolve" (click)="openResolve(alert)">
                <app-icon icon="mdi:check-all" />
                Resolver
              </button>
            </div>
          </div>
          }
        </div>
        }
      </section>

      <!-- Historial -->
      <section class="panic-list-section">
        <h3 class="panic-list-section__subtitle">Historial</h3>
        @if (historyAlerts().length === 0) {
        <p class="panic-list-empty">No hay historial de alertas.</p>
        } @else {
        <div class="panic-list">
          @for (alert of historyAlerts(); track alert.id) {
          <div class="panic-card">
            <div class="panic-card__header">
              <app-icon
                [icon]="getStatusIcon(alert.status)"
                class="panic-card__status-icon"
                [style.color]="getStatusColor(alert.status)"
              />
              <div>
                <span class="panic-card__name">{{ alert.triggeredByName }}</span>
                <span class="panic-card__time">{{ formatTime(alert.createdAt) }}</span>
                <span class="panic-card__status-badge" [style.background]="getStatusColor(alert.status)">
                  {{ alert.status }}
                </span>
              </div>
            </div>
            @if (alert.attendedByName) {
            <p class="panic-card__meta">Atendida por {{ alert.attendedByName }} — {{ formatTime(alert.attendedAt!) }}</p>
            }
            @if (alert.resolvedByName) {
            <p class="panic-card__meta">Resuelta por {{ alert.resolvedByName }} — {{ formatTime(alert.resolvedAt!) }}</p>
            }
            @if (alert.resolutionNotes) {
            <p class="panic-card__message">{{ alert.resolutionNotes }}</p>
            }
            @if (alert.status === "Atendida") {
            <div class="panic-card__actions">
              <button type="button" class="panic-card__btn panic-card__btn--resolve" (click)="openResolve(alert)">
                <app-icon icon="mdi:check-all" />
                Resolver
              </button>
            </div>
            }
          </div>
          }
        </div>
        }
      </section>

      <!-- Resolver modal -->
      @if (selectedAlert()) {
      <div class="panic-overlay" (click)="closeResolve()">
        <div class="panic-resolve-dialog" (click)="$event.stopPropagation()">
          <h3>Resolver alerta</h3>
          <div class="panic-resolve-dialog__actions">
            <button type="button" class="panic-card__btn panic-card__btn--resolve" (click)="onResolve('Resolved')">
              <app-icon icon="mdi:check" />
              Resuelta
            </button>
            <button type="button" class="panic-card__btn panic-card__btn--false" (click)="onResolve('FalseAlarm')">
              <app-icon icon="mdi:close" />
              Falsa Alarma
            </button>
          </div>
          <textarea
            class="panic-resolve-dialog__notes"
            placeholder="Notas de resolución (opcional)"
            [value]="resolveNotes()"
            (input)="resolveNotes.set($any($event.target).value)"
            rows="3"
          ></textarea>
          <div class="panic-resolve-dialog__footer">
            <button type="button" class="panic-card__btn panic-card__btn--cancel" (click)="closeResolve()">Cancelar</button>
          </div>
        </div>
      </div>
      }
    </div>
  `,
  styles: `
    .panic-list-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 16px;
    }

    .panic-list-page__title {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 24px;
    }

    .panic-list-section {
      margin-bottom: 32px;
    }

    .panic-list-section__subtitle {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ds-text-secondary, #6b7280);
      margin: 0 0 12px;
    }

    .panic-list-empty {
      color: var(--ds-text-secondary, #9ca3af);
      font-size: 14px;
    }

    .panic-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .panic-card {
      background: var(--ds-bg-card, #fff);
      border: 1px solid var(--ds-border, #e5e7eb);
      border-radius: 12px;
      padding: 16px;
    }

    .panic-card--active {
      border-color: #dc2626;
      box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
    }

    .panic-card__header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 8px;
    }

    .panic-card__status-icon {
      font-size: 24px;
    }

    .panic-card__name {
      font-weight: 600;
      display: block;
    }

    .panic-card__time {
      font-size: 12px;
      color: var(--ds-text-secondary, #6b7280);
      display: block;
    }

    .panic-card__status-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      margin-top: 4px;
    }

    .panic-card__message {
      font-size: 13px;
      color: var(--ds-text-secondary, #374151);
      font-style: italic;
      margin: 4px 0;
    }

    .panic-card__meta {
      font-size: 12px;
      color: var(--ds-text-secondary, #6b7280);
      margin: 2px 0;
    }

    .panic-card__map {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #2563eb;
      font-size: 13px;
      text-decoration: none;
    }

    .panic-card__map:hover {
      text-decoration: underline;
    }

    .panic-card__actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    .panic-card__btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .panic-card__btn--attend { background: #dc2626; color: white; }
    .panic-card__btn--resolve { background: #16a34a; color: white; }
    .panic-card__btn--false { background: #d97706; color: white; }
    .panic-card__btn--cancel { background: var(--ds-bg-secondary, #f3f4f6); }

    .panic-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .panic-resolve-dialog {
      background: var(--ds-bg-card, #fff);
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 100%;
    }

    .panic-resolve-dialog h3 {
      margin: 0 0 16px;
      font-size: 16px;
      font-weight: 700;
    }

    .panic-resolve-dialog__actions {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .panic-resolve-dialog__notes {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--ds-border, #d1d5db);
      border-radius: 6px;
      font-size: 13px;
      resize: vertical;
      box-sizing: border-box;
    }

    .panic-resolve-dialog__footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
    }
  `,
})
export class PanicAlertList implements OnInit {
  private apiResponseS = inject(ApiResponseService);

  activeAlerts = signal<PanicAlertDto[]>([]);
  historyAlerts = signal<PanicAlertDto[]>([]);
  selectedAlert = signal<PanicAlertDto | null>(null);
  resolveNotes = signal("");

  ngOnInit(): void {
    this.loadActive();
    this.loadHistory();
  }

  async loadActive(): Promise<void> {
    const result = await this.apiResponseS.onGetList<PanicAlertDto[]>(
      "PanicAlerts/active",
    );
    if (result) this.activeAlerts.set(result);
  }

  async loadHistory(): Promise<void> {
    const result = await this.apiResponseS.onGetList<PanicAlertDto[]>(
      "PanicAlerts/history",
    );
    if (result) this.historyAlerts.set(result);
  }

  async onAttend(alert: PanicAlertDto): Promise<void> {
    await this.apiResponseS.onPut(`PanicAlerts/${alert.id}/attend`, {});
    this.loadActive();
    this.loadHistory();
  }

  openResolve(alert: PanicAlertDto): void {
    this.selectedAlert.set(alert);
  }

  async onResolve(status: string): Promise<void> {
    const alert = this.selectedAlert();
    if (!alert) return;

    const dto: PanicAlertResolveDto = {
      status,
      resolutionNotes: this.resolveNotes() || null,
    };

    await this.apiResponseS.onPut(`PanicAlerts/${alert.id}/resolve`, dto);
    this.closeResolve();
    this.loadActive();
    this.loadHistory();
  }

  closeResolve(): void {
    this.selectedAlert.set(null);
    this.resolveNotes.set("");
  }

  getMapUrl(alert: PanicAlertDto): string {
    return `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`;
  }

  formatTime(isoDate: string): string {
    return new Date(isoDate).toLocaleString("es-MX", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case "Atendida": return "mdi:clock-check";
      case "Resuelta": return "mdi:check-circle";
      case "Falsa Alarma": return "mdi:close-circle";
      default: return "mdi:alert-circle";
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "Atendida": return "#d97706";
      case "Resuelta": return "#16a34a";
      case "Falsa Alarma": return "#6b7280";
      default: return "#dc2626";
    }
  }
}
